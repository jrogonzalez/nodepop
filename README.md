Practica DevOps: 
Ejercicio 1: 
    - URL nodepop: http://ec2-52-2-169-225.compute-1.amazonaws.com/api/v1/advertisements/tagList (ejemplo de llamada al metodo tagList)
    - URL staticos nodepop: http://ec2-52-2-169-225.compute-1.amazonaws.com/images/iphone.jpeg y http://ec2-52-2-169-225.compute-1.amazonaws.com/images/bici.jpeg
Ejercicio 2:
    - URL bootstrap: http://52.2.169.225/

Nodepop API Information.

1- Existe un comando introducido en el package.json que se llama installDB que de debe ejecutar desde consola antes de arrancar la aplicacion. El comando a ejecutar es el siguiente
    "npm run installDB" y su finalidad es poblar de datos la BBDD. La base de datos se llama nodepopdb y las colecciones que se borran son "advertisements" y "users" y se introducen en estas
    valores nuevos desde los ficheros ./data/advertisements.json y ./data/users.json.
     En la coleccion users podeis observar que los valores de las password estan modificados con un HASH para que no reconozcan pero en el fichero json se pueden observar en claro. Este comportamiento no es normal puesto que los passwords no de deben poner
     en claro en ningun fichero Json, si se desea se pueden hashear directamente en el Json y asi guardarlos directamente encriptados

2- Arranque de la api por linea de comandos con el comando "npm run start" y arranca el servidor en modo cluster con 4 nodos.

3- Las operaciones disponibles son las siguientes:
    NOTA: todas as operacines deben llevar en la cabecera de la llamada informado el parametro x-lang con un valor es o en para poder mostrar los mensajes de error en español o en ingles.
        El idioma por defecto es ingles.

    users:
        /*
        * type method: POST
        * entry param: username    type: String    required: true
        * entry param: password    type: String    required: true
        * entry param: email       type: String    required: true
        * entry param: pushtoken   type: String    required: false
        *
        * return: JSON
        *    param: success        type: boolean
        *    param: message        type: String
        */
        RUTA: /api/v1/users/createUser
        DESCRIPCION DE LA OPERACION: Creacion de un usuario en BBDD, el parametro pushtoken no es obligatorio y se refiere al pushtoken para poder enviar notificaciones.
                                     La contraseña queda como HASH al guardarla en BBDD


        /*
        * type method: GET
        * entry param: token    type: JWT    required: true
        *
        * return: JSON
                *    param: success        type: boolean
                *    param: result         type: [User]
        */
        RUTA: /api/v1/users/showUsers
        DESCRIPCION DE LA OPERACION: Muestra los usuarios que existen. No tiene parametros de entrada y retorna una lista de usuarios.


        /*
        * type method: POST
        * entry param: email     type: String   required: true
        * entry param: password  type: String   required: true
        *
        * return: JSON
        *    param: success        type: boolean
        *    param: token          type: JWT
        */
        RUTA: /api/v1/users/authenticate
        DESCRIPCION DE LA OPERACION: Autentica a un usuario introducidos los parametros email y contraseña. Devuelve un token que se usara para tener acceso a realizar diferentes operaciones.

        /*
        * type method: DELETE
        * entry param: token     type: JWT      required: true
        * entry param: email     type: String   required: true
        * entry param: password  type: String   required: true
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: result        type: String
        */
        RUTA: /api/v1/users/removeUser
        DESCRIPCION DE LA OPERACION: Borra un usuario de la base de datos dado su email y password. Requiere de un token en la entrada para poder realizar la operacion.

        /*
        * type method: PUT
        * entry param: token       type: JWT       required: true
        * entry param: username    type: String    required: true
        * entry param: password    type: String    required: false
        * entry param: email       type: String    required: false
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: result        type: String
        */
        RUTA: /api/v1/users/updateUser
        DESCRIPCION DE LA OPERACION: Modifica el password y/o el email para un nombre de usuario dado. Requiere de un token en la entrada para poder realizar la operacion.


    advertisements:

        *
        * type method: GET
        * entry param: token         type: JWT       required: true
        * entry param: name          type: String    required: false
        * entry param: sell          type: Boolean   required: false
        * entry param: start         type: Number    required: false
        * entry param: limit         type: Number    required: false
        * entry param: sort          type: Boolean   required: false
        * entry param: price         type: Boolean   required: false
        * entry param: includeTotal  type: Boolean    required: false
        * entry param: tags          type: [String] ['work', 'lifestyle', 'motor', 'mobile']    required: false
        *
        * return: JSON
        *    param: success          type: boolean
        *    param: advertisements   type: [advertisements]
        */
        RUTA: /api/v1/advertisements/searchAdvertisement
        DESCRIPCION DE LA OPERACION: Operacion que busca advertisements en vbase a varios criterios:
            - nombre: coincidencia del nombre o que empiece por el mismo.
            - precio: 10­50 buscará anuncios con precio incluido entre estos valores  {precio:
                            { '$gte': '10', '$lte': '50' } }
                      ○ 10­ buscará los que tengan precio mayor que 10  
                            {precio:{'$gte': '10' } }
                      ○ ­50 buscará los que tengan precio menor de 50
                            {precio:{'$lte':'50' } }
                      ○ 50 buscará los que tengan precio igual a 50
                            {precio:'50'}
            - sell (compra o venta)
            - start & limit: paginacion de incio de busqueda y de fin de busqueda.
            - sort: orden ascendente.
            - IncludeTotal: saca el numero de registros que se han encontrado cumpliendo las caracteriticas.
            - tags: incluye la busqueda de os tags que se han introducido por la entrada en formato tag=""&tag=""

        *
        * type method: PUT
        * entry param: token     type: JWT       required: true
        * entry param: name      type: String    required: true
        * entry param: sell      type: Boolean   required: true
        * entry param: price     type: Number    required: false
        * entry param: photo     type: String    required: false
        * entry param: tags      type: [String] ['work', 'lifestyle', 'motor', 'mobile']    required: true
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: message       type: String
        */
        RUTA: /api/v1/advertisements/createAdvertisement
        DESCRIPCION DE LA OPERACION: Crea un anuncio a partir de los datos de entrada.

        *
        * type method: GET
        * entry param: token       type: JWT       required: true
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: results       type: [Advertisements]
        */
        RUTA: /api/v1/advertisements/showAdevertisement
        DESCRIPCION DE LA OPERACION: Muestra todos los anuncios sin filtro alguno. Requiere Token de entrada

        *
        * type method: GET
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: taglist       type: [String]
        */
        RUTA: /api/v1/advertisements/tagList
        DESCRIPCION DE LA OPERACION: Devuelve la lista de los taglist que tiene los anuncios en la BBDD. No tiene parametros de etrada y tampoco requiere token



    pushTokens:
        /*
        * type method: POST
        * entry param: username    type: String                 required: false
        * entry param: pushToken   type: String                 required: true
        * entry param: plattform   type: String [andoird, ios]  required: false
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: result        type: String
        */
        RUTA: /api/v1/pushTokens/createPushToken
        DESCRIPCION DE LA OPERACION: Crea en base de datos una instancia de PushToken y ademas si el username esta informado introduce el
                                token en el campo PushToken de la entidad User correspondiente a ese usuario.


        /*
        * type method: DELETE
        * entry param: token       type: JWT       required: true
        * entry param: username    type: String    required: false
        * entry param: pushToken   type: String    required: true
        *
        * return: JSON
        *    param: success       type: boolean
        *    param: result        type: String
        */
        RUTA: /api/v1/pushTokens/removePushToken
        DESCRIPCION DE LA OPERACION: Operacion que borra de la BBDD el push token y si se le ha pasado el usuario por parametro de entrada busca y borra
                                    el pushtoken de la coleccion users para ese usuario.
