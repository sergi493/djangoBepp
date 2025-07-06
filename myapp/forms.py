from django import forms
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CreateNewTask(forms.Form):
    title=forms.CharField(label="Titulo tarea:")
    description=forms.CharField(label="Descripcion de tarea:", widget=forms.Textarea)
    
class CreateNewProject(forms.Form):
    name=forms.CharField(label="name projecttt")


from django import forms
class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'Introduce tu nombre de usuario', 'class': 'form-control'}
    ))
    password1 = forms.CharField(widget=forms.PasswordInput(
        attrs={'placeholder': 'Introduce tu contraseña', 'class': 'form-control'}
    ))
    password2 = forms.CharField(widget=forms.PasswordInput(
        attrs={'placeholder': 'Repite tu contraseña', 'class': 'form-control'}
    ))

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']