from rest_framework.views import exception_handler
from django.db.models.deletion import ProtectedError
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler to get the standard error response
    response = exception_handler(exc, context)

    # Handle ProtectedError
    if isinstance(exc, ProtectedError):
        return Response({
            'error': 'Bu Çegi pozup bolmaýar, sebäbi muňa baglanan bir töleg bar. Ilki bilen Tölegi, soňra Çegi pozuň.',
            'details': str(exc)  # Optional: Add more details if necessary
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # If response is None, that means DRF didn't handle the exception, so handle it here if needed
    if response is None:
        # Optional: Customize any other general exception here if needed
        return Response({
            'error': 'Bir ýalnyşlyk boldy, täzeden synanşyň.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response  # Use default response for other exceptions
