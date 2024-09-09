from rest_framework.permissions import (
    BasePermission, IsAuthenticated, IsAdminUser
) 
    

from accounts.models import AccountRole


# class IsBaslyk(IsAuthenticated, IsAdminUser, BasePermission):
class IsBaslyk(IsAuthenticated, IsAdminUser, BasePermission):
    """
    Permission class to restrict access to company owners for objects belonging to their company.
    """
    
    def has_permission(self, request, view):
        if super().has_permission(request, view):
            return True
        
        # Check for authentication and baslyk role
        if not AccountRole.objects.filter(
            account=request.user, role__role_name='baslyk'
        ).exists():
            return False
        return True  # Allow all actions for company owners (subject to object-level check)


class IsOrunbasar(IsBaslyk):
    """
    Permission class to restrict access to company yonetici for objects belonging to their company.
    """
    
    def has_permission(self, request, view):
        if super().has_permission(request, view):
            return True

        # Check for authentication and orunbasar role
        if not AccountRole.objects.filter(
            account=request.user, role__role_name='orunbasar'
        ).exists():
            return False
        return True  # Allow all actions for company yonetici (subject to object-level check)


class IsIsgar(IsOrunbasar):
    """
    Permission class to restrict access to company rezervasyoncu for objects belonging to their company.
    """
    
    def has_permission(self, request, view):
        if super().has_permission(request, view):
            return True

        # Check for authentication and isgar role
        if not AccountRole.objects.filter(
            account=request.user, role__role_name='isgar'
        ).exists():
            return False
        return True  # Allow all actions for company rezervasyoncu (subject to object-level check)

