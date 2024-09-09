from django_filters import rest_framework as filters
from django.db.models import Q

from .models import (
    Role, Account, AccountRole
) 


class AccountFilterSet(filters.FilterSet):
    role = filters.CharFilter(method='filter_by_role')

    class Meta:
        model = Account
        fields = ['role']  # Only include the 'role' field for filtering
    

    def filter_by_role(self, queryset, name, value):
        return queryset.filter(company_role__role__id=value)
    