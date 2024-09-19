import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FormErrorPrinterService {

  constructor(
    private messageService: MessageService, 
  ) {}

  printFormValidationErrors(form: any) {
    this.messageService.clear(); // Clear existing messages
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.get(controlName);
        if (control && control.invalid) {
          const errorMessages = this.getErrorMessages(controlName, control.errors);
          errorMessages.forEach(message => {
            this.messageService.add({ severity: 'error', summary: 'Ýalňyşlyk', detail: message });
          });
        }
      }
    }

    // <p *ngIf="cekForm.errors?.['clientOrSupplierRequired']">Either client or supplier is required.</p>
    // loop form errors and print them
    if (form.errors) {
      for (const errorKey in form.errors) {
        if (form.errors.hasOwnProperty(errorKey)) {
          switch (errorKey) {
            case 'clientOrSupplierRequired':
              this.messageService.add({ severity: 'error', summary: 'Ýalňyşlyk', detail: 'Müşderilerden ýa-da Telekeçilerden biri saýlanmaly.' });
              break;
            // Add more cases here for other types of validation errors if needed
            default:
              this.messageService.add({ severity: 'error', summary: 'Ýalňyşlyk', detail: 'Dogry däl.' });
          }
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
              messages.push(`${this.getControlLabel(controlName)} hökmany.`);
              break;
            case 'minlength':
              messages.push(`${this.getControlLabel(controlName)} iň az ${errors['minlength'].requiredLength} harakter bolmaly.`);
              break;
            case 'maxlength':
              messages.push(`${this.getControlLabel(controlName)} ${errors['maxlength'].requiredLength} harakterden uzyn bolup bilmeýär.`);
              break;
            case 'pattern':
              messages.push(`${this.getControlLabel(controlName)} formady ýalňyş.`);
              break;
            case 'email':
              messages.push(`${this.getControlLabel(controlName)} dogry poçta adres bolmaly.`);
              break;
            case 'clientOrSupplierValidator':
              messages.push(`${this.getControlLabel(controlName)} Müşderi ýa-da Telekeçiden biri saýlanmaly.`);
              break;
            // Add more cases here for other types of validation errors if needed
            default:
              messages.push(`${this.getControlLabel(controlName)} dogry däl.`);
            
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
      client: 'Müşteri',
      supplier: 'Tedarikçi',
      is_nesye: 'Nesye',
      alan_zatlary: 'Alan Zatlary',
      referenced_by: 'Referans',
      reference_percentage: 'Referans Yüzdesi',
      date: 'Tarih',
      cek_type: 'Çek Türü',
      no: 'No',

    };
    return labels[controlName] || controlName;
  }
}
