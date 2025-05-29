import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActorService } from '../../service/actor.service';
import { Usuario } from '../../model/Usuario';
import { Direccion } from '../../model/Direccion';
import { ItemPedido } from '../../model/ItemPedido';
import { PedidoService } from '../../service/pedido.service';
import { Pedido } from '../../model/Pedido';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  cartItems: ItemPedido[] = [];
  direcciones: Direccion[] = [];
  selectedAddressId: number | null = null;
  isLoading = false;
  currentUser: Usuario | null = null;
  showSuccessModal = false;

  constructor(
    private actorService: ActorService,
    private pedidoService: PedidoService,
    private router: Router)
     {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadCartItems();
    if (this.currentUser) {
      this.loadUserAddresses();
    }
  }

  loadCurrentUser() {
    this.actorService.userLogin().subscribe({
      next: response => {
        this.currentUser = response as Usuario;
        if (this.currentUser) {
          this.loadUserAddresses();
        }
      },
      error: error => {
        console.error('Error loading current user:', error);
        this.currentUser = null;
      }
    }); 
  }

  loadCartItems() {
    const cartStr = localStorage.getItem('carrito');
    if (cartStr) {
      try {
        const cartData = JSON.parse(cartStr);
        this.cartItems = cartData.map((item: any) => {
          const itemPedido = new ItemPedido(item.producto, item.cantidad, item.total);
          itemPedido.id = item.id;
          return itemPedido;
        });
      } catch (error) {
        console.error('Error parsing cart data:', error);
        this.cartItems = [];
      }
    } else {
      this.cartItems = [];
    }
  }

  loadUserAddresses() {
    if (!this.currentUser) {
      this.direcciones = [];
      return;
    }

    if (this.currentUser.direcciones && this.currentUser.direcciones.length > 0) {
      this.direcciones = this.currentUser.direcciones;
    } else {
      // Try to load from separate localStorage key
      const addressesStr = localStorage.getItem(`addresses_${this.currentUser.id}`);
      if (addressesStr) {
        try {
          this.direcciones = JSON.parse(addressesStr);
        } catch (error) {
          console.error('Error parsing addresses:', error);
          this.direcciones = [];
        }
      }
    }
  }

  updateQuantity(productId: number, change: number) {
    const item = this.cartItems.find(item => item.producto.id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.cantidad + change);
      item.cantidad = newQuantity;
      item.total = item.producto.precio * newQuantity;
      this.saveCartToLocalStorage();
    }
  }

  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.producto.id !== productId);
    this.saveCartToLocalStorage();
  }

  saveCartToLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.cartItems));
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.total, 0);
  }

  getShipping(): number {
    return this.cartItems.length > 0 ? 5 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  createOrder() {
    if (!this.selectedAddressId || this.cartItems.length === 0 || !this.currentUser) {
      return;
    }

    const selectedAddress = this.direcciones.find(dir => dir.id === this.selectedAddressId);
    if (!selectedAddress) {
      console.error('Selected address not found');
      return;
    }

    this.isLoading = true;
    const pedido = new Pedido(new Date(), selectedAddress, this.cartItems);

    this.pedidoService.createPedido(pedido).subscribe({
      next: response => {
        console.log('Order created successfully:', response);
        // Clear cart after successful order
        this.cartItems = [];
        localStorage.removeItem('carrito');
        this.isLoading = false;
        
        // Show success modal
        this.showSuccessModal = true;
        
        // Auto redirect after 3 seconds if user doesn't click the button
        setTimeout(() => {
          if (this.showSuccessModal) {
            this.closeModalAndRedirect();
          }
        }, 15000);
      },
      error: error => {
        console.error('Error creating order:', error);
        this.isLoading = false;
      }
    });
  }

  closeModalAndRedirect() {
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }

  navigateToProducts() {
    this.router.navigate(['/cartas']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  agregarDireccion() {
    this.router.navigate(['/perfil/editar']);
  }
}
