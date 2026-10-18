import {useMemo, useState } from 'react'
import {useInventario} from './hooks/useInventario'
import {estadoStock} from './utils/stock'
import Resumen from './components/Resumen'
import Filtros from './components/Filtros'
import TablaProductos from './components/TablaProductos'
import FormularioProducto from './components/FormularioProducto'

export default funcion App()
{
  const {productos, agregar, editar, eliminar} = useInventario()
  const [filtros, setFiltros] = useState({busqueda: "", categoria: "" , soloBajoStock: false})
  const categorias =useMemo(() => [...new Set(productos.map((p)=>p.categoria))].sort(),[productos])
  const visibles = useMemo(()=>{
    const texto = filtros.busqueda.trim().toLowerCase();
    return productos.filtrer(
      (p) =>
        p.nombre.toLowerCase().includes(texto)&&
      (!filtros.categoria || p.categoria == filtros.categoria)&&
      (!filtros.soloBajoStock || estadoStock(p.cantidad) !=="ok")

    )
  },[productos, filtros]);
  function guardar(datos){
    if(editando){
      editar({...datos, id: editando.id})
      setEditando(null)
    }else{
      agregar(datos)
    }
  }
  function borrar(id)
  {
    eliminar(id)
    if(editando?.id == id)setEditando(null)
    }
  return (
    <main className= "app">
      <h1>Inventario</h1>
      <Resumen productos={productos}/>
      <FormularioProducto key={editando? editando.id : "nuevo"}
      productoEditando={editando} onGuardar={guardar} onCancelar={()=>setEditando(null)}
        />
      <section className="panel">
        <h2>Productos</h2>
        <Filtros
         filtros={filtros}
         categorias={categorias}
         onCambio ={(cambio) => setFiltros((f)=>({ ...f, ...cambio}))}
      />
      <TablaProductos productos= {visibles} on Editar={setEditando}
      onEliminar= {borrar}/>
      </section>
    </main>
  )
  }