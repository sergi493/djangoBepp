
from django.urls import path
from . import views
from .views import guardar_ticket

urlpatterns = [
     path("login/", views.signin, name="login"),
     path("signup/", views.signup, name="ind"),
     path("logout/", views.signout, name="logout"),
     path("user/", views.user, name="user"),
     path("", views.signin, name="home"),
    path("pedidos/", views.pedidos, name="pedidos"),
    path("hoy/", views.hoy, name="hoy"),
    path("presupostos/", views.presupostos, name="presupostos"),
    path("reparacions/", views.reparacions, name="reparacions"),
    path("index/", views.index, name="index"),
    path("vender/", views.vender, name="vender"),
    path("facturas/", views.facturas, name="facturas"),
    path("tickets/", views.tickets, name="tickets"),
    path("devoluciones/", views.tasks, name="devoluciones"),
    path("stock/", views.stock, name="stock"),
     path("clientes/", views.clientes, name="clientes"),
     path("create_project/", views.create_project, name="create_project"),
    path("guardar_ticket/", views.guardar_ticket, name='guardar_ticket'),
    path("guardar_factura/", views.guardar_factura, name='guardar_ticket'),
    path("guardar_productos_ticket/", views.guardar_productos_ticket, name='guardar_productos_ticket'),
    path("guardar_productos_factura/", views.guardar_productos_factura, name='guardar_productos_ticket'),
    path('get_ticket_data/<int:ticket_id>/', views.get_ticket_data, name='get_ticket_data'),
    path('obtenir_pressupost/<int:pressupostId>/', views.obtenir_pressupost, name='obtenir_pressupost'),
     path('obtenir_reparacio/<int:reparacioId>/', views.obtenir_reparacio, name='obtenir_reparacio'),
    
    
    path('get_factura_data/<int:factura_id>/', views.get_factura_data, name='get_factura_data'),
    path('estadisticas/', views.estadisticas, name='estadisticas'),
    path('guardar_cliente/', views.guardar_cliente, name='guardar_cliente'),
    path('crear_client/', views.guardar_cliente, name='guardar_client'),
    
   path('obtenir_factura_compra/<int:facturaReferencia>/', views.obtenir_factura_compra, name='obtenir_factura_compra'),
    
    

    path("crear_producte/", views.crear_producte, name="crear_producte"),
    path("filtrar_tickets/", views.filtrar_tickets, name="filtrar_tickets"),
    path("producte_datos/<producteId>/", views.producte_datos, name="producte_datos"),
    path("modificar_producte/", views.modificar_producte, name="modificar_producte"),
    path("modificar_client/", views.modificar_client, name="modificar_client"),
    path("client_datos/<clientId>/", views.client_datos, name="client_datos"),
    path("facturar_ticket/", views.facturar_ticket, name="facturar_ticket"),
    path("afegir_ultim_producte/", views.afegir_ultim_producte, name="afegir_ultim_producte"),
    path("ultim_client_id/", views.ultim_client_id, name="ultim_client_id"),
    path("crear_nou_pressupost/", views.crear_nou_pressupost, name="crear_nou_pressupost"),
    path("reembolsar_factura/", views.reembolsar_factura, name="reembolsar_factura"),
    path("reembolsar_ticket/", views.reembolsar_ticket, name="reembolsar_ticket"),
    path("crear_pedido/", views.crear_pedido, name="crear_pedido"),
    path("ficar_factura_pedido/", views.ficar_factura_pedido, name="ficar_factura_pedido"),
    path("aplicar_rebre_factura_compra/", views.aplicar_rebre_factura_compra, name="aplicar_rebre_factura_compra"),
    path("aplicar_factura_compra/", views.aplicar_factura_compra, name="aplicar_factura_compra"),
    path("facturar_pressupost/", views.facturar_pressupost, name="facturar_pressupost"),
    path("afegir_producte_pressupost/", views.afegir_producte_pressupost, name="afegir_producte_pressupost"),
    path("aplicar_pressupost/", views.aplicar_pressupost, name="aplicar_pressupost"),
    path("borrar_de_pressupost/", views.borrar_de_pressupost, name="borrar_de_pressupost"),
    path("crear_nou_reparacio/", views.crear_nou_reparacio, name="crear_nou_reparacio"),
    
    path("facturar_reparacio/", views.facturar_reparacio, name="facturar_reparacio"),
    path("afegir_producte_reparacio/", views.afegir_producte_reparacio, name="afegir_producte_reparacio"),
    path("aplicar_reparacio/", views.aplicar_reparacio, name="aplicar_reparacio"),
    path("borrar_de_reparacio/", views.borrar_de_reparacio, name="borrar_de_reparacio"),
    
    path('tancar_caixa/', views.tancar_caixa, name='tancar_caixa'),
    path('enviar_factura_email/', views.enviar_factura_email, name='enviar_factura_email'),
    

    
    
]
