
const express = require('express')
const app = express()
const productManager = require('./productManager')

//traduce las url a objetos javaScript para que puedan ser interpretaados
app.use(express.urlencoded({extended:true}))


/**
 * endPoint que mustra todos los productos o limita una cantidad especifica a mostrar
 */
app.get('/products',async (req, res) => {

  //query limit que limita la cantidad de productos a mostrar
  const productsNum = parseInt(req.query.limit)
  try {
    setTimeout(async () => {
      const products = await productManager.getProducts(productsNum)
      res.send({message:products})
    }, 2000)
  }catch(error){
    console.error('error al cargar productos', error)
  }

})



/**
 * endPoint que muestra un producto por su id
 */
app.get('/products/:id',async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    setTimeout(async () => {
      const productId = await productManager.getProductById(id)
      if(!productId){
        return res.status(404).json({message: 'producto no encontrado'})
      }
      res.json({message: productId})
    }, 3000)
  } catch (error) {
    res.status(400).json({message:'id invalido'})
  }
})


/**
 * endPoint que elimina un producto segun su id
 */
app.delete('/products/:id',async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    setTimeout(async => {
      const productDelete = productManager.deleteProduct(id)
      productDelete
      return res.json({message:`producto ${id} eliminado`})
    },2000)
  }catch(error){
    res.status(500).json({message:'error al eliminar el producto'})
  }
})



//Servidor encendido en puerto 8080
const port = 8080
app.listen(port, () => {
  console.log(`server running at port ${port}`)
})