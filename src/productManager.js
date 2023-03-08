const fs = require('fs')
//decidi utilizar el metodo joi para validar los datos de los productos
const Joi = require('Joi')





class ProducManager{
  constructor(path){
    this.path = path
    this.productos = []
    this.idGenerator = 0
  }

  /**
   * metodo que agrega un producto con sus respectivosparametros
   */

  addProduct(nombre, descripcion, price, img, code, stock) {

    //valida los datos de cada parametro y los condiciona de forma simple
    const schema = Joi.object({
      nombre: Joi.string().required(),
      descripcion: Joi.string().required(),
      price: Joi.number().min(0).required(),
      img: Joi.string().optional(),
      code: Joi.string().required(),
      stock: Joi.number().min(0).required(),
    })
    const result = schema.validate({ nombre, descripcion, price, img, code, stock })
    if (result.error) {
      throw new Error(result.error.details[0].message)
    }

    //crea un nuevo objeto con todas sus propiedades agregando el id incrementado
    const id = ++this.idGenerator
    const product = {
      id,
      nombre,
      descripcion,
      price,
      img,
      code,
      stock
    }


    this.productos.push(product)
    const data = JSON.stringify(this.productos)


    fs.writeFile(this.path, data, (error) => {
      if(error){
        console.error('error al escribir el archivo', error)
      } else {
        console.log(`producto ${id} agregado`)
      }
    })
  }


  /**
   * metodo que muestra todos los productos  que existen
   */
  getProducts(limit){
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, ('utf-8')))
      if(limit){
        return productos.slice(1, limit)
      }else{
        return productos
      }
    }catch(error){
      console.error("error al cargar los productos", error)
    }
  }

  /**
   * metodo que muestra un producto segun el id definido en la instancia
   */
  getProductById(id){
    try {
      const producto = JSON.parse(fs.readFileSync(this.path, 'utf8'))
      const productoId = producto.find(product => product.id === id)
      return productoId
    }catch(error){
      console.error("error al cargar tu producto", error)
    }
  }

  /**
   * metodo que actualiza un valor de un producto ej: precio,     descripcion, stock
   **/
  updateProduct(id, stock){
  const prodcuto = this.productos.find(producto => producto.id === id)
  prodcuto["stock"] = stock
  const data = JSON.stringify(this.productos)
  try {
    fs.writeFileSync(this.path, data)
    console.log(`producto ${id} actualizado`)
  }catch(error){
    console.error('error al sobreescribir el archivo', error)
  }
  }

  /**
   * metodo que elimina un prodcuto
   */
  deleteProduct(id){
    try {
      const productos = JSON.parse(fs.readFileSync(this.path, 'utf-8',))
      const index = productos.findIndex(producto => producto.id === id)


      if(index !== -1){
        productos.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(productos, null, 2))
        console.log(`producto ${id} eliminado`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * metodo que elimina todo el archivo de productos
   */
  deleteAllProducts(){
    try {
      fs.unlinkSync(this.path)
      console.log("todos productos se han eliminado con exito")
    } catch (error) {
      console.error("error al eliminar archivo")
    }
  }
}



//instancia de la clase
const productManager = new ProducManager('../data/Productos.json')
module.exports = productManager

