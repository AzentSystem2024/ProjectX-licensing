import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private originalX = 0;
  private originalY = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.originalX = rect.left;
    this.originalY = rect.top;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'move');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    this.renderer.setStyle(this.el.nativeElement, 'left', `${this.originalX + deltaX}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${this.originalY + deltaY}px`);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
  }
}
