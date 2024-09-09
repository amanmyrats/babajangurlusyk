import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorPrinterService {

  constructor(
    private messageService: MessageService, 
    // private translateService?: TranslateService
  ) {} // Inject messageService and optional translateService

  public printHttpError(err: any): void {
    console.log("HttpErrorPrinterService.printHttpError()");
    console.log(err);
    this.messageService.clear();
    if (err.error) {
      for (const [key, value] of Object.entries(err.error)) {
        // const translatedKey = this.translateKey(key); // Optional translation
        // const translatedValue = this.translateValue(value); // Optional translation
        const string_value = value!.toString();

        const is_failed_login = string_value.toLowerCase().includes('no_active_account'.toLowerCase());
        if (is_failed_login) {
          this.messageService.add({ severity: 'error', summary: key, detail: 'E-Posta veya şifre hatalı.' });
        } else {
          this.messageService.add({ severity: 'error', summary: key, detail: value as string });
        }

      }
    } else {
      console.error('Beklenmedik hata:', err);
      this.messageService.add({ severity: 'error', summary: 'Unexpected Error', detail: 'An unexpected error occurred.' }); // Default error message
    }
  }
}