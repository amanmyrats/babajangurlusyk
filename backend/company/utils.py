import logging 


logger = logging.getLogger('transfertakip')

def check_expense_types():
    expense_types = [
        'AÝLYK',
        'SALGYT',
        'BAŞGA',
    ]
    from company.models import ExpenseType
    for expense_type in expense_types:
        expense_type_exists = ExpenseType.objects.filter(name=expense_type).exists()
        if not expense_type_exists:
            ExpenseType.objects.create(
                name=expense_type
            )