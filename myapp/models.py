from django.db import models
from django.core.exceptions import ValidationError
# Create your models here.

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    codigo = models.CharField(max_length=200)
    cantidad= models.IntegerField()
    descripcion= models.CharField(max_length=300,default='')
    precio= models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='imagenes/')
    preu_distribuidor=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    marge=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    def __str__(self):
        return self.nombre+ " - " + self.codigo + " - " + str(self.cantidad) + " - " + str(self.precio) + "€"
def validate_not_zero(value):
    if value == "0" or value == "0.00":
        raise ValidationError('El valor no puede ser igual a cero.')
class Ticket(models.Model):
    numero = models.IntegerField(default=1)
    date = models.DateTimeField()
    METODO_PAGO_CHOICES = [
        ('Efectiu', 'Efectiu'),
        ('Targeta', 'Tarjeta'),
        ("Transferencia","Transferencia"),
        ("Chec bancari","Chec bancari"),
        ("Domiciliacio","Domiciliacio")
    ]
    metodo_pago = models.CharField(max_length=50, choices=METODO_PAGO_CHOICES, default='Efectiu')
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[validate_not_zero])
    abono=models.IntegerField(null=True)
    
class ProductoEnTicket(models.Model):
    ticket_id = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    preu_venut=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    preu_distribuidor=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    marge=models.DecimalField(max_digits=10, decimal_places=2,default=1)

class Avui(models.Model):
    data=models.DateTimeField()
    calaix_obert=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    calaix_tancat=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ingressat_banc=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    targeta=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    efectiu=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    altres=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    marge=models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
class Apuntes(models.Model):
    id_avui = models.ForeignKey(Avui, on_delete=models.CASCADE)
    quantitat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    motiu = models.CharField(max_length=200, default="")
    
class Facturas(models.Model):
    numero= models.IntegerField(default=1)
    persona_id=models.IntegerField()
    date=models.DateTimeField()
    METODO_PAGO_CHOICES = [
        ('Efectivo', 'Efectivo'),
        ('Targeta', 'Tarjeta'),
    ]
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES, default='Efectivo')
    total= models.DecimalField(max_digits=10, decimal_places=2)
    abono=models.CharField(max_length=10, default=" ")
    procedencia=models.CharField(max_length=30, default=" ")
    taula_id_procedencia=models.IntegerField(default=0)
class ProductoEnFactura(models.Model):
    factura_id = models.ForeignKey(Facturas, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    preu_venut=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    preu_distribuidor=models.DecimalField(max_digits=10, decimal_places=2,default=1)
    marge=models.DecimalField(max_digits=10, decimal_places=2,default=1)
class FacturaCompra(models.Model):
    referencia_factura=models.CharField(max_length=30)
    data=models.DateTimeField()
    total= models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    estat=models.CharField(default="pendent", max_length=50)
class Pedidos(models.Model):
    producto_id = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantitat=models.IntegerField(default="1")
    nota=models.CharField(max_length=100, blank=True)
    factura_compra=models.CharField(max_length=100, blank=True)
    rebut=models.CharField(max_length=10, default="NO")
    factura_compra_id=models.ForeignKey(FacturaCompra, on_delete=models.CASCADE, null=True)
    
    

    
class Pressupost(models.Model):
    persona_id      = models.IntegerField()
    date            = models.DateTimeField()
    facturat        = models.CharField(max_length=10, default="no")
    total           = models.DecimalField(max_digits=12, decimal_places=2)
    metodo_pago     = models.CharField(
                          max_length=20,
                          choices=[('Targeta','Targeta'),('Efectivo','Efectiu')],
                          default='Targeta'
                      )
    nota = models.CharField(max_length=300, default="")

class ProducteEnPressupost(models.Model):
    pressupost = models.ForeignKey(Pressupost, on_delete=models.CASCADE)
    producte = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantitat = models.PositiveIntegerField(default=1)


class Reparacio(models.Model):
    persona_id=models.IntegerField()
    date=models.DateTimeField()
    
    facturat=models.CharField(max_length=10, default="no")
    total= models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago     = models.CharField(
                          max_length=20,
                          choices=[('Targeta','Targeta'),('Efectivo','Efectiu')],
                          default='Targeta'
                      )
    nota = models.CharField(max_length=300, default="")
class ProducteEnReparacio(models.Model):
    reparacio = models.ForeignKey(Reparacio, on_delete=models.CASCADE)
    producte = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantitat = models.PositiveIntegerField(default=1)

class Persona(models.Model):
    nombre=models.CharField(max_length=200, default=" ")
    localidad= models.CharField(max_length=200)
    calle=models.CharField(max_length=200)
    nif=models.CharField(max_length=200)
    telefono=models.IntegerField()
    email=models.EmailField(blank=True)
    comp_banc=models.CharField(max_length=200)
    direccion=models.CharField(max_length=200, default="")
    def __str__(self):
        return self.nombre+ " - " + self.localidad + " - " + self.calle + " - " + self.nif + " - " + str(self.telefono)
    

class Reparacions(models.Model):
    persona_id=models.ForeignKey(Persona, on_delete=models.CASCADE)
    total=models.DecimalField(max_digits=10, decimal_places=2)
    data=models.DateTimeField()
    METODO_PAGO_CHOICES = [
        ('Efectivo', 'Efectivo'),
        ('Targeta', 'Tarjeta'),
    ]
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES, default='Efectivo')
    descripcio=models.CharField(max_length=300)
    material_entregat=models.CharField(max_length=300)
    
class ProducteReparacio(models.Model):
    reparacio_id=models.ForeignKey(Reparacions, on_delete=models.CASCADE)
    producte=models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad=models.IntegerField()
    
"""
class Project(models.Model):
    name=models.CharField(max_length=200)
    
    def __str__(self):
        return self.name
    
class Task(models.Model):
    title=models.CharField(max_length=200)
    description = models.TextField()
    project=models.ForeignKey(Project, on_delete=models.CASCADE)
    done=models.BooleanField(default=False)
    def __str__(self):
        return self.title + " --> " + self.project.name
    """