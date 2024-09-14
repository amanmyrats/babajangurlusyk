# from rest_framework_simplejwt.serializers import TokenUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# class CustomTokenUserSerializer(TokenUserSerializer):
#     def get_user_details(self, user):
#         user_data = super().get_user_details(user)
#         user_data['user_id'] = user.id  # Add user ID to the data
#         user_data['first_name'] = user.first_name
#         if user.company:
#             user_data['company_id'] = user.company.id
#         else:
#             user_data['company_id'] = ''
#         if user.company_role:
#             user_data['role'] = user.company_role.role.role_name
#         else:
#             user_data['role'] = ''
#         return user_data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        # Add custom user data
        data['user_id'] = self.user.id
        data['first_name'] = self.user.first_name
        data['is_superuser'] = self.user.is_superuser
        if hasattr(self.user, 'account_role') and self.user.account_role:
            data['role'] = self.user.account_role.role.name
        else:
            data['role'] = ''

        return data
