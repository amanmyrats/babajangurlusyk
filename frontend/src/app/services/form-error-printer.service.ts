import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FormErrorPrinterService {

  constructor(
    private messageService: MessageService, 
  ) {}

  printFormValidationErrors(driverForm: any) {
    this.messageService.clear(); // Clear existing messages
    for (const controlName in driverForm.controls) {
      if (driverForm.controls.hasOwnProperty(controlName)) {
        const control = driverForm.get(controlName);
        if (control && control.invalid) {
          const errorMessages = this.getErrorMessages(controlName, control.errors);
          errorMessages.forEach(message => {
            this.messageService.add({ severity: 'error', summary: 'Doğrulama Hatası', detail: message });
          });
        }
      }
    }
  }

  getErrorMessages(controlName: string, errors: any): string[] {
    const messages: string[] = [];
    if (errors) {
      for (const errorKey in errors) {
        if (errors.hasOwnProperty(errorKey)) {
          switch (errorKey) {
            case 'required':
              messages.push(`${this.getControlLabel(controlName)} zorunlu.`);
              break;
            case 'minlength':
              messages.push(`${this.getControlLabel(controlName)} en az ${errors['minlength'].requiredLength} karakter olmalı.`);
              break;
            case 'maxlength':
              messages.push(`${this.getControlLabel(controlName)} ${errors['maxlength'].requiredLength} karakterden uzun olamaz.`);
              break;
            case 'pattern':
              messages.push(`${this.getControlLabel(controlName)} formatı yanlış.`);
              break;
            case 'email':
              messages.push(`${this.getControlLabel(controlName)} geçerli bir e-posta adresi olması lazım.`);
              break;
            // Add more cases here for other types of validation errors if needed
            default:
              messages.push(`${this.getControlLabel(controlName)} geçerli değil.`);
            
            // Add more cases here for other types of validation errors (e.g., minlength, maxlength, pattern)
          }
        }
      }
    }
    return messages;
  }

  getControlLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      first_name: 'İsim',
      last_name: 'Soyisim',
      phone: 'Telefon',
      tc_no: 'TC NO',
      email: 'E-Posta',
      role: 'Rol',
      salary: 'Maaş',
      plate: 'Plaka',
      brand: 'Marka',
      model: 'Model',
      year: 'Yıl',
      seat_count: 'Koltuk Sayısı',
      name: 'İsim',
      code: 'Kod',
      sign: 'İşaret',
      expense_type: 'Gider Türü',
      description: 'Açıklama',
      amount: 'Miktar',
      currency: 'Para Birimi',
      yetkili: 'Yetkili',
      address: 'Adres',
      iban_no: 'IBAN',
      iban_name: 'IBAN Adı',
      iban_bank: 'IBAN Bankası',
      note: 'Not',
      owner: 'Sahibi',
      contact_phone: 'Telefon',
      contact_email: 'E-Posta',
      subscription: 'Abonelik',
      password: 'Şifre',
      payment_type: 'Ödeme Türü',
      partner_type: 'Partner Türü',
    };
    return labels[controlName] || controlName;
  }
}
