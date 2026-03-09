function validate(schema,target = 'body') {
  return (req, res, next) => {
    const data = req[target]; // body, query, params, etc
    
    // Paso 1: Verificar que existan los datos
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        message: `El ${target} no contiene datos`
      });
    }

    // Paso 2: Validar contra el esquema con opciones para permitir campos adicionales
    const { error, value } = schema.validate(data,{
        abortEarly: false, // No detenerse en el primer error, mostrar todos los errores
        stripUnknown: true, // eliminar campos no definidos en el esquema
        }
    );

    // Paso 3: Si hay errores de validación, devolver 400 con mensajes claros
    if (error) {
      return res.status(400).json({ 
        message: `Error de validación en ${target}`,
        details: error.details.map(err => err.message)
      });
    }

    //Paso 4: Reemplazar el objeto original con los datos validados y limpios
    req[target] = value;

    next();
  };
}

export default validate;