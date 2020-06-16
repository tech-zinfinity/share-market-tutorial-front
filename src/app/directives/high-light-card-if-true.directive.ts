import { Directive, Input, Renderer2, ElementRef, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighLightCardIfTrue]'
})
export class HighLightCardIfTrueDirective implements OnInit, OnChanges{

  @Input() appHighLightCardIfTrue : any;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() { }

  ngOnChanges(changes){
    //console.log('coming here', JSON.stringify(this.appHighLightCardIfTrue), this.el.nativeElement);

    if(changes['appHighLightCardIfTrue']){
      if(this.appHighLightCardIfTrue === true){
        console.log('coming here rgba(10, 252, 46, 0.653)');
        
        this.renderer.setAttribute(this.el.nativeElement, 'background-color', 'cyan');
      }
    }
  }

}
