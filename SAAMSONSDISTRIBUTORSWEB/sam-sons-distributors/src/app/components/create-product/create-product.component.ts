import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  form: FormGroup;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]]
  });
  }
  

   onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;

      this.productService.create(this.form.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.form.reset();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error creating product', err);
          // Optionally show error message here
        }
      });
    }
  }
}