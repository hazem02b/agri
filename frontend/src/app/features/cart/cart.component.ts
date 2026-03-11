import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { CreateOrderRequest, OrderItem } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  currentStep: 'cart' | 'delivery' | 'payment' = 'cart';
  loading = false;
  
  // Delivery form
  deliveryForm = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    deliveryMethod: 'livraison' // 'livraison' or 'retrait'
  };

  // Payment form
  paymentForm = {
    method: 'cash', // 'cash', 'card', 'mobile'
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    if (confirm('Êtes-vous sûr de vouloir retirer ce produit du panier ?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getDeliveryFee(): number {
    return this.deliveryForm.deliveryMethod === 'livraison' ? 5.00 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee();
  }

  proceedToDelivery(): void {
    if (this.cartItems.length === 0) {
      this.toastService.warning('Votre panier est vide !');
      return;
    }
    this.currentStep = 'delivery';
    window.scrollTo(0, 0);
  }

  proceedToPayment(): void {
    // Validate delivery form
    if (!this.deliveryForm.fullName || !this.deliveryForm.phone || !this.deliveryForm.address || !this.deliveryForm.city) {
      this.toastService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    this.currentStep = 'payment';
    window.scrollTo(0, 0);
  }

  placeOrder(): void {
    // Validate payment form
    if (this.paymentForm.method === 'card') {
      if (!this.paymentForm.cardNumber || !this.paymentForm.cardName || !this.paymentForm.cardExpiry || !this.paymentForm.cardCvv) {
        this.toastService.warning('Veuillez remplir toutes les informations de paiement');
        return;
      }
    }

    this.loading = true;

    // Prepare order items
    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Prepare order request
    const orderRequest: CreateOrderRequest = {
      items: orderItems,
      deliveryAddress: {
        fullName: this.deliveryForm.fullName,
        phone: this.deliveryForm.phone,
        address: this.deliveryForm.address,
        city: this.deliveryForm.city,
        postalCode: this.deliveryForm.postalCode,
        notes: this.deliveryForm.notes
      },
      paymentMethod: this.paymentForm.method,
      totalAmount: this.getTotal()
    };

    // Send order to backend
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.cartService.clearCart();
        this.toastService.success('Commande passée avec succès ! Merci pour votre achat.');
        this.router.navigate(['/my-orders']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating order:', error);
        this.toastService.error('Erreur lors de la création de la commande. Veuillez réessayer.');
      }
    });
  }

  backToCart(): void {
    this.currentStep = 'cart';
  }

  backToDelivery(): void {
    this.currentStep = 'delivery';
  }

  continueShopping(): void {
    this.router.navigate(['/marketplace']);
  }
}
