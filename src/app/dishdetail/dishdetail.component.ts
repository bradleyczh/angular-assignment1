import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; //tracks the location of the page in the browser history; this enables the back() functionality
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import { visibility, flyInOut, expand } from '../animations/app.animation';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  reviewForm: FormGroup;
  review: Comment;
  errMsg: string;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be at least 2 characters long.',
      'maxlength': 'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required.'
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(+params['id']);
      })
      .subscribe(
        dish => {
          this.dish = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        errMsg => {
          this.dish = null;
          this.errMsg = <any>errMsg;
        });
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  createForm(): void {
    this.reviewForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', Validators.required],
      date: new Date().toString()
    });
    this.reviewForm.valueChanges.subscribe(
      data => this.onValueChanged(data),
      errMsg => this.errMsg = <any>errMsg);
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.reviewForm) { return; }
    const form = this.reviewForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.review = this.reviewForm.value;
    this.dish.comments.push(this.review);
    this.reviewForm.reset({
      name: '',
      rating: 5,
      comment: '',
      date: new Date().toString()
    });
  }

}
