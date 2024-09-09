

def check_initial_roles():
    """
    baslyk
    orunbasar
    isgar
    """
    from accounts.models import Role
    roles = [
        'baslyk',
        'orunbasar',
        'isgar',
    ]
    for role in roles:
        role_exists = Role.objects.filter(role_name=role).exists()
        if not role_exists:
            Role.objects.create(role_name=role)