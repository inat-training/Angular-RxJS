import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ])
  .pipe(
    map(([products, selectectCategoryId]) =>
      products.filter(product =>
          selectectCategoryId ? product.categoryId === selectectCategoryId : true
        )),
      catchError(error => {
        this.errorMessage = error;
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productsCategories$
  .pipe(
    catchError( error => {
      this.errorMessage = error;
      return EMPTY;
    })
  );

  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }


  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
