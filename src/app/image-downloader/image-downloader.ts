import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChangeValueAction, ImageStyleEnum } from '../ts';
import { FormsModule } from '@angular/forms';
import { Colors } from '../ts/Model/Colors';
import { VintageStyle } from '../ts/ViewModel/VintageStyle';
import { ClassicFantasyStyle } from '../ts/ViewModel/ClassicFantasyStyle';


@Component({
  selector: 'image-downloader',
  imports: [FormsModule],
  templateUrl: './image-downloader.html',
  styleUrl: './image-downloader.css',
})
export class ImageDownloader {
  rows = 0;
  cols = 0;

  public imageStyle = ImageStyleEnum.BINARY;
  private continentColor: any;
  private seaColor: any;

  private displayImage: any;


  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('downloadLink')
  downloadLink!: ElementRef<HTMLAnchorElement>;


  private _inputImage: any;
  @Input()
  set inputImage(image: any) {
      if (!image) return;    
      if (this._inputImage !== undefined){
          this._inputImage.delete();
      }
      this.rows = image.rows;
      this.cols = image.cols;
      this._inputImage = image.clone();

      this.applyStyleChanges();
  }
  get inputImage(){ return this._inputImage; }


  downloadImage() {
    const link = this.downloadLink.nativeElement
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }

  onStyleChange(newVal: ImageStyleEnum) {
    this.setProperty('imageStyle', newVal as ImageStyleEnum)
  }

  protected setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
  }
  
  handleValuesChanged(): void {
      this.applyStyleChanges();
  }

  applyStyleChanges(){
    if (this.imageStyle === ImageStyleEnum.BINARY){
      this.continentColor = Colors.WHITE;
      this.seaColor = Colors.BLACK;
    } else if (this.imageStyle === ImageStyleEnum.CLASSIC_FANTASY){
      this.continentColor = Colors.rgb(3, 100, 3);
      this.seaColor = Colors.rgb(108, 219, 253);
    } 
    if (this.displayImage !== undefined){
      this.displayImage.delete();
    }
    this.displayImage = new cv.Mat(this.rows, this.cols, cv.CV_8UC3)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this._inputImage.ucharPtr(i, j)[0] == 0) {
          this.displayImage.ucharPtr(i, j)[0] = this.seaColor[0];
          this.displayImage.ucharPtr(i, j)[1] = this.seaColor[1];
          this.displayImage.ucharPtr(i, j)[2] = this.seaColor[2];
        } else {
          this.displayImage.ucharPtr(i, j)[0] = this.continentColor[0];
          this.displayImage.ucharPtr(i, j)[1] = this.continentColor[1];
          this.displayImage.ucharPtr(i, j)[2] = this.continentColor[2];
        }
      }
    }
    
    if (this.imageStyle === ImageStyleEnum.VINTAGE){
      this.displayImage = VintageStyle.apply(this.displayImage);
    } else if (this.imageStyle === ImageStyleEnum.CLASSIC_FANTASY){
      this.displayImage = ClassicFantasyStyle.apply(this._inputImage);
    }
    cv.imshow(this.canvasRef.nativeElement, this.displayImage);
  } 


  logClickedColor($event: PointerEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = ($event.clientX - rect.left) * (this.displayImage.cols / rect.width);
    const y = ($event.clientY - rect.top) * (this.displayImage.rows / rect.height);
    const pixel = this.displayImage.ucharPtr(y, x);
    console.log(`Clicked color: ${pixel[0]}`);
  }

  resetVintageSeeds() {
    VintageStyle.resetSeeds();
    ClassicFantasyStyle.resetSeeds();
    this.applyStyleChanges();
  }

}
