# EcommerceProyectoFinal

Se realiza el despliegue en render, url : https://ecommerce-yfta.onrender.com

Se crean las rutas para obtener una lista de usuarios con sus datos principales, en /api/users/ get. y se crea otra ruta para eliminar todos los usuarios que no se hayan conectado en los ultimos 2 dias, de igual manera, se envia un correo notificando al ususario que fue eliminada la cuenta de la plataforma, se crea la vista necesaria para poder visualizar la lista de usarios, para poder editar el rol de los usuarios, y poder eliminar a cualquiera que se desee, se modifican los permisos para que solo quien tenga persmisos de administrador pueda acceder a esa vista, y realizar dichas acciones, la ruta que se creo para las notificaciones, se crea en mail/sendmail/usuariodestino, enviandole por el body el message y el subject del correo.

Se modifica el endpoint que elimina productos en donde si el producto fue creado por algun usuario premium y se elimina el producto, el dueño o quien creo el producto sea notificado por correo que se elimino un producto que el creo, por otra parte, se pulen procesos, se comentan algunos console.log para que la consola este mas libre al momento que se ejecutan los proceso.

Tambien se eliminan los console.log para que queden limpios los console.log.

Se mueve la ruta /api/users/premium/idUser a un router específico para usuarios en /api/users/, tambien se modifica el modelo de 
User para que cuente con una nueva propiedad “documents” el cual es un array el cual contiene las propiedades : name, status y fileName, 
de igual manera, se crea en el modelo de user, la propiedad llamada last_connection la cual se modifica al iniciar sesion, colocando
la fecha de ultimo ingreso, por otra parte, se crea un endpoint en el router de usuarios api/users/:id/documents y 
/uploadFile/:nombreCarpeta/:id con el método POST que permita subir uno o múltiples archivos con ayuda del middleware Multer para 
poder recibir los documentos que se carguen y actualiza el usuario su status para hacer saber que ya subió algún documento, multer
quedo configurado para que se guarden en diferentes carpetas, como lo es: Si se sube una imagen de perfil, deberá guardarlo en una 
carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar 
un documento, multer los guardará en una carpeta documents, y cada uno de los documetos, como lo es la Identificación, Comprobante de 
domicilio y el Comprobante de estado de cuenta, tendran sus carpetas individuales, llamadas: identificacion, comprobanteDomicilio y 
comprobanteEstadoCuenta, en este apartado, tambien se modifica el endpoint /api/users/premium/idUser para que se actualice el perfil
del ususario siempre y cuando tenga los documentos identificación, Comprobante de domicilio y Comprobante de estado de cuenta subidos 
en la plataforma, se añade una condicion para que esto solo se aplique a los perfiles de ususarios y no a los premium.



Se realizan modulos de testing utilizando mocha, chai y supertest, se incluyen 3 test para el router de products, 3 para el router
de carts y 3 para el router de sessions, se realizan test de status, verificacion del valor que devuelve y que tipo de dato debe
traer la respuesta.

Se realiza la documentacion respectiva del modulo de productos y el modulo de carrito, esto con ayuda de swagger-jsdoc y
de swagger-ui-express 

Se agrega un sistema de recuperación de contraseña, la cual se envia por medio de un correo electronico, desde la vista login atraves
de la opcion "olvidemicontraseña" para poder reestablecerla con una nueva, se envia un link al correo el cual tendra una hora para expirar,
si el usuario no entra en una hora, el link se deshabilita y elimina de la base, cuando ingresa al link e intenta reestablecer la 
contraseña con la misma anterior, no lo deja realizar la accion, de igual manera, se establece un nuevo rol en el schema para usuario 
agregando premium a la lista, y en el schema de producto, se agrega un nuevo campo owner el cual hace referencia a la persona que agrego 
el producto a la lista, se coloca el id de la persona si el usuario que agrego el producto es premium, sino solo se coloca admin, esto
tambien se le añade a la logica donde se crean 100 productos, por otra parte, se modifican los permisos de editar y eliminar para que
el usuario premium solo pueda borrar productos que le pertenecen y que el administrador si pueda borrar a cualquiera, ademas, se añade
la logica para que un user premium no pueda agregar un producto propio al carrito de el, y se implementa una nueva ruta en el router de
sessions (/api/sessions/premium/:id), lpa cual permite cambiar de rol de usuario a premium y de premium a ususario, a todo esto se le 
crea sus determinadas interfaces y vistas.

Se incluye un sistema de niveles implementando logger a partir del uso de winston con la siguiente prioridad de menor a mayor 
(debug, http, info, warning, error, fatal), de igual forma, se de implementa un logger para desarrollo y produccion, el cual se 
tomara trayendo el ambiente desde una variable de entorno, el logger de desarrollo loggea a partir del nivel de debug en la consola, 
y el logger de produccion loggea a partir del nivel info en consola, en ambos ambientes se crea un archivo errors.log que imprime niveles 
de log desde warning en ambos casos, se añaden algunos logs por el aplicativo en su mayoria sustitutos de console.log, los cuales 
loggean actividades realizadas en la aplicacion, y se crea la ruta /testLogger para imprimir los niveles de logger y probarlos.

Se Genera modulo de Mocking para poder generr 100 productos fake a partir del uso de faker-js/faker, siguiendo la estructura que
se ha manejado en el model de products, el endpoind determinado para esta fucionalidad es "/mockingproducts", de igual manera, se
crea manejador de errores personalizados, en donde se usa un middleware, un generador personalizado de errores y un diccionario de
errores.

Se modifica la capa de persistencia para usar un DAO y DTO, mejor implementado para la logica de user, se realiza un middleware 
para crear un sistema de autorizacion para delimitar los endpoints para que el admin solo pueda crear, actualiar y eliminar productos, 
tambien para que solo el usuario pueda enviar mensajes al chat y que sea el unico que pueda agregar productos al carrito, de igual forma,
se crea un modelo ticket, el cual cuenta con la estructura definida, Id (autogenerado por mongo) code: String debe autogenerarse y 
ser único purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra, amount: Number, total de la 
compra.purchaser: String, contendrá el correo del usuario asociado al carrito, se crea la ruta /id/purchase para ayudar con el proceso 
de compra, en donde se valida el stock de los productos que se van a comprar y si el ususario desea continuar, comprar los que tienen el 
stock y dejar en el carrito los que no tienen stock, de igual manera, se actualiza el stock al completar el proceso de compra.

Se reesctructura el proyecto para que este construido por capas, ahora cuenta con las capas routing, controller, dao y
views, cada uno con las responsabilidades delegadas, de igual manera, se crea el archivo config y por medio del uso de dotenv,
permite trabajar bajo variables de entorno desde este archivo, se deja el archivo .env en el repo por practicidad pero se entiende
que no debe de ir ya que tiene información sensible.

Se ajusta el modelo de user, añadiendo a los campos que ya se tenian, el campo de cart, el cual contiene un id con referencia a carts, 
creando las opciones en la interfaz de products para poder añadir el producto al cart del usuario, tambien se añade boton que redirige al cart,
de igual manera, y se aclara que el sistema de login de ususario se trabaja a partir de session y no con jwt, se agrega a la vista 
las opciones que faltaban para filtrar desde el lado del cliente el limit o cantidad de productos por pagina, si se quiere ordenar o 
si se quiere buscar por un producto en especifico.


Se refactoriza la logica de login, ahora cuenta con hasheo de contraseña utilizando bcrypt, 
de igual forma, se implementa passport, passport-local para el login y register del aplicativo, y se añade la opcion de registro e 
inicio de sesión rapida con github (passport-github2)

---------------------------
Se agregan las vistas de login y registro de usuarios, en el cual se trabaja con sessions y mongo, 
para persistir las sesiones de los ususarios, de igual manera, se hace la respectiva redireccion de las vistas de login a register,
register a login y login a products en donde se visualiza un mensaje con el usuario logueado, del mismo modo, se creo una card 
en la vista products donde aparece el nombre, rol y correo electronico del ususario que inicio sesion, tambien, 
se creo el boton de cerrar sesion, el cual apartir de destroy, cierra sesion del ususario, y se agrega el sistema de roles,
en especial el correo adminCoder en donde si se intenta iniciar sesion con ese correo, se valida por codigo y se trata de un rol 
super admin el cual no vive en la base de datos, el resto de operaciones para productos y cart se mantienen funcionales 

En la ruta raiz "/" se dejo el login 
de igual forma, get("/login) 
y register ("/register")


----------- 
Uso de bd mongo atlas con colecciones 
  carts: 
    get - http://localhost:8080/api/carts/ -> traera toda la lista de carritos 
    post - http://localhost:8080/api/carts -> agregara un carrito a la coleccion
    put - http://localhost:8080/api/carts/idCarrito/product/idProduct -> modificara el carrito y si el producto ya existe sumara uno
                                example: 649bc54f1f5f6b1c9f3fa619/papas/3
    delete - http://localhost:8080/api/carts/idCarrito - se eliminara el carrito por el id
  products:
    get - http://localhost:8080/api/products -> traera toda la lista de productos 
    post - http://localhost:8080/api/products -> agregara un producto a la coleccion por body
            {"title":"agua","description":"bebida","price":2.66,"thumbnail":"ruta2.png","code":"bebidas#543","stock":33,"id":2}
    put -http://localhost:8080/api/products/id -> modificara el producto por id enviandolo por  body exmpId:649badf39bbbdc87450ff4e1
      example:{"title": "agua","description": "bebida","price": "4.66","thumbnail": "rutaagua.png", "code": "bebidas#543", "stock": "20"}
    delete - http://localhost:8080/api/carts/idProduct - se eliminara el carrito por el id

    messages: http://localhost:8080/api/chat/ - post - enviando user y message por body  y  get - render de chat con handlebars
      http://localhost:8080/api/chat/messages - get para obtener la lista de mensajes
