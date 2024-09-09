import logging 


logger = logging.getLogger('transfertakip')

def check_initial_currencies():
    from common.models import Currency
    initial_currencies = [
        ('TMT', 'Türkmen Manat', 'TMT'),
        ('USD', 'US Dollar', '$'),
    ]
    for currency in initial_currencies:
        currency_exists = Currency.objects.filter(code=currency[0]).exists()
        if not currency_exists:
            Currency.objects.create(
                code=currency[0], name=currency[1], symbol=currency[2]
            )


def check_initial_units():
    from common.models import Unit
    initial_units = [
        ('kg', 'kilogram'),
        ('ton', 'tonna'),
        ('lt', 'litr'),
        ('mt', 'metr'),
        ('m2', 'metrkwadrat'),
        ('m3', 'metrkub'),
        ('sany', 'sany'),
    ]
    for unit in initial_units:
        unit_exists = Unit.objects.filter(code=unit[0]).exists()
        if not unit_exists:
            Unit.objects.create(
                code=unit[0], name=unit[1]
            )