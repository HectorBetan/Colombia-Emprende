import { useState, useEffect } from "react";
import { categorys } from "../../models/Categorys.model";
import { citys } from "../../models/City.model";
import imgStore from "../../assets/img-store.jpg";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
function Stores(data) {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState(4);
  const [w, setW] = useState(window.innerWidth);
  const [active, setActive] = useState(1);
  const [categ, setCateg] = useState("");
  const [ciud, setCiud] = useState("");
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const setDataView = () => {
      let storesViewDat;
      if (cargando) {
        try {
          storesViewDat = JSON.parse(sessionStorage.getItem("storesViewData"));
        } catch (error) {}
        if (storesViewDat) {
          setActive(storesViewDat.active);
          setResultados(storesViewDat.resultados);
          setCateg(storesViewDat.categoria);
          setCiud(storesViewDat.ciudad);
          search(storesViewDat.categoria, storesViewDat.ciudad);
        }
        setCargando(false);
        sessionStorage.removeItem("storesViewData");
      }
    };
    setDataView();
  });
  const handleResize = () => {
    setW(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const lista = data.data;
  const [newList, setNewList] = useState(null);
  const Pagi = (data) => {
    let res = resultados + 1;
    const size = data.data.length / res;
    const pages = Math.ceil(size);
    let items = [];
    for (let number = 1; number <= pages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={(e) => {
            e.preventDefault();
            setActive(number);
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
    if (pages > 7) {
      let s = "";
      if (w < 400) {
        s = "sm";
      }
      return (
        <div className="d-flex justify-content-center">
          <Pagination size={s}>
            <Pagination.First
              onClick={(e) => {
                e.preventDefault();
                setActive(1);
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
            <Pagination.Prev
              onClick={(e) => {
                e.preventDefault();
                if (active > 1) {
                  setActive(active - 1);
                }
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
            {active !== 1 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(1);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                1
              </Pagination.Item>
            )}
            {active !== 2 && active <= 4 && active !== 1 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(2);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                2
              </Pagination.Item>
            )}
            {active === 4 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(3);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                3
              </Pagination.Item>
            )}
            {active > 4 && <Pagination.Ellipsis />}
            {active > 4 && active < pages - 2 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(active - 1);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {active - 1}
              </Pagination.Item>
            )}
            {active > pages - 3 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(pages - 4);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {pages - 4}
              </Pagination.Item>
            )}
            {active > pages - 3 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(pages - 3);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {pages - 3}
              </Pagination.Item>
            )}
            {active < pages - 2 && (
              <Pagination.Item active={true}>{active}</Pagination.Item>
            )}
            {active < pages - 3 && active > pages - 4 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(pages - 3);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {pages - 3}
              </Pagination.Item>
            )}
            {active < pages - 2 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(active + 1);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {active + 1}
              </Pagination.Item>
            )}
            {active >= pages - 2 && (
              <Pagination.Item
                active={active === pages - 2}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(pages - 2);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {pages - 2}
              </Pagination.Item>
            )}
            {active !== 4 && active < 5 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(active + 2);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {active + 2}
              </Pagination.Item>
            )}
            {active !== 3 && active !== 4 && active < 5 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(active + 3);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {active + 3}
              </Pagination.Item>
            )}
            {active === 1 && active < 5 && (
              <Pagination.Item
                active={false}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(active + 4);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {active + 4}
              </Pagination.Item>
            )}
            {active < pages - 3 && <Pagination.Ellipsis />}
            {active >= pages - 3 && (
              <Pagination.Item
                active={active === pages - 1}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(pages - 1);
                  if (w < 768) {
                    window.scrollTo(0, 50);
                  } else {
                    window.scrollTo(0, 150);
                  }
                }}
              >
                {pages - 1}
              </Pagination.Item>
            )}
            <Pagination.Item
              active={active === pages}
              onClick={(e) => {
                e.preventDefault();
                setActive(pages);
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            >
              {pages}
            </Pagination.Item>
            <Pagination.Next
              onClick={(e) => {
                e.preventDefault();
                if (active < pages) {
                  setActive(active + 1);
                }
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
            <Pagination.Last
              onClick={(e) => {
                e.preventDefault();
                setActive(pages);
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
          </Pagination>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={(e) => {
                e.preventDefault();
                if (active > 1) {
                  setActive(active - 1);
                }
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
            {items}
            <Pagination.Next
              onClick={(e) => {
                e.preventDefault();
                if (active < pages) {
                  setActive(active + 1);
                }
                if (w < 768) {
                  window.scrollTo(0, 50);
                } else {
                  window.scrollTo(0, 150);
                }
              }}
            />
          </Pagination>
        </div>
      );
    }
  };
  const DataView = () => {
    if (lista) {
      return (
        <div className="pb-3">
          {lista.map((data, i) => {
            let img;
            if (!data.value.store.Imagen) {
              img = imgStore;
            } else {
              img = data.value.store.Imagen;
            }
            if (!data.value.store.Delete) {
              return (
                <div key={i}>
                  {data.key >= (active - 1) * (resultados + 1) &&
                    data.key <= active * (resultados + 1) - 1 && (
                      <div key={data.key} className="card   store-box">
                        <div className="d-flex flex-row">
                          <img
                            src={img}
                            className="card-img-top rounded img-tiendas"
                            alt="..."
                          />
                          <div className="card-body card-caja">
                            <h5 className="card-title store-title">
                              {data.value.store.Nombre}
                            </h5>
                            <h4 className="card-text store-categoria">
                              {w >= 325 && <span>Categoria: </span>}
                              <span className="stores-cel">
                                {data.value.store.Categoria}
                              </span>
                            </h4>
                            <h3 className="card-text store-ciudad">
                              {w >= 325 && <span>Ciudad: </span>}
                              <span className="stores-cel">
                                {data.value.store.Ciudad}
                              </span>
                            </h3>
                            <h3 className="card-text store-celular">
                              {w >= 325 && <span>Celular: </span>}
                              <span className="stores-cel">
                                {data.value.store.Celular}
                              </span>
                            </h3>
                            {w > 670 && (
                              <h4 className="card-text store-email">
                                {w > 670 && <span>E-mail: </span>}
                                <span className="stores-cel">
                                  {data.value.store.Email}
                                </span>
                              </h4>
                            )}
                            {w <= 670 &&
                              w > 575 &&
                              data.value.store.Nombre.length <= 24 && (
                                <h4 className="card-text store-email">
                                  {w > 575 &&
                                    data.value.store.Email.length < 20 && (
                                      <span>E-mail: </span>
                                    )}
                                  <span className="stores-cel">
                                    {data.value.store.Email}
                                  </span>
                                </h4>
                              )}
                            {w <= 575 &&
                              w > 500 &&
                              data.value.store.Nombre.length <= 24 && (
                                <h4 className="card-text store-email">
                                  {w > 500 &&
                                    data.value.store.Email.length < 20 && (
                                      <span>E-mail: </span>
                                    )}
                                  <span className="stores-cel">
                                    {data.value.store.Email}
                                  </span>
                                </h4>
                              )}
                          </div>
                        </div>
                        <div className="text-center pb-2 card-footer">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/emprendimientos/${data.value.store.Path}`
                              );
                              const storesViewData = {
                                active: active,
                                resultados: resultados,
                                categoria: categ,
                                ciudad: ciud,
                              };
                              sessionStorage.setItem(
                                "storesViewData",
                                JSON.stringify(storesViewData)
                              );
                            }}
                            className="btn btn-primary text-center boton-tienda"
                          >
                            Ir a la Tienda
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              );
            } else {
              return true;
            }
          })}
          <Pagi data={lista} />
        </div>
      );
    }
  };
  const DataViewCategoria = () => {
    if (newList) {
      return (
        <div className="pb-3">
          {newList.map((data, i) => {
            let img;
            if (!data.value.store.Imagen) {
              img = imgStore;
            } else {
              img = data.value.store.Imagen;
            }
            return (
              <div key={i}>
                {i >= (active - 1) * (resultados + 1) &&
                  i <= active * (resultados + 1) - 1 && (
                    <div key={data.key} className="card   store-box">
                      <div className="card d-flex flex-row">
                        <img
                          src={img}
                          className="card-img-top rounded img-tiendas"
                          alt="..."
                        />
                        <div className="card-body card-caja">
                          <h5 className="card-title store-title">
                            {data.value.store.Nombre}
                          </h5>
                          <h4 className="card-text store-categoria">
                            {w >= 325 && <span>Categoria: </span>}
                            <span className="stores-cel">
                              {data.value.store.Categoria}
                            </span>
                          </h4>
                          <h3 className="card-text store-ciudad">
                            {w >= 325 && <span>Ciudad: </span>}
                            <span className="stores-cel">
                              {data.value.store.Ciudad}
                            </span>
                          </h3>
                          <h3 className="card-text store-celular">
                            {w >= 325 && <span>Celular: </span>}
                            <span className="stores-cel">
                              {data.value.store.Celular}
                            </span>
                          </h3>
                          {w > 670 && (
                            <h4 className="card-text store-email">
                              {w > 670 && <span>E-mail: </span>}
                              <span className="stores-cel">
                                {data.value.store.Email}
                              </span>
                            </h4>
                          )}
                          {w <= 670 &&
                            w > 575 &&
                            data.value.store.Nombre.length <= 24 && (
                              <h4 className="card-text store-email">
                                {w > 575 &&
                                  data.value.store.Email.length < 20 && (
                                    <span>E-mail: </span>
                                  )}
                                <span className="stores-cel">
                                  {data.value.store.Email}
                                </span>
                              </h4>
                            )}
                          {w <= 575 &&
                            w > 500 &&
                            data.value.store.Nombre.length <= 24 && (
                              <h4 className="card-text store-email">
                                {w > 500 &&
                                  data.value.store.Email.length < 20 && (
                                    <span>E-mail: </span>
                                  )}
                                <span className="stores-cel">
                                  {data.value.store.Email}
                                </span>
                              </h4>
                            )}
                        </div>
                      </div>
                      <div className="text-center pb-2 card-footer d-grid gap-2 d-md-block">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/emprendimientos/${data.value.store.Path}`
                            );
                            const storesViewData = {
                              active: active,
                              resultados: resultados,
                              categoria: categ,
                              ciudad: ciud,
                            };
                            sessionStorage.setItem(
                              "storesViewData",
                              JSON.stringify(storesViewData)
                            );
                          }}
                          className="btn btn-primary text-center boton-tienda"
                        >
                          Ir a la Tienda
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
          {newList.length > 0 && <Pagi data={newList} />}
        </div>
      );
    }
  };
  const ciudades = citys;
  const cityLista = ciudades.map((city) => {
    return (
      <option key={city} value={city} className="text-dark">
        {city}
      </option>
    );
  });
  const categorias = categorys;
  const categoriaList = categorias.map((categoria) => {
    return (
      <option key={categoria} value={categoria} className="text-dark">
        {categoria}
      </option>
    );
  });
  const search = (categoriaSelect, citySelect) => {
    let list;
    if (categoriaSelect && citySelect) {
      list = lista.filter((data) => {
        return (
          data.value.store.Ciudad === citySelect &&
          data.value.store.Categoria === categoriaSelect
        );
      });
    }
    if (citySelect && !categoriaSelect) {
      list = lista.filter((data) => {
        return data.value.store.Ciudad === citySelect;
      });
    }
    if (categoriaSelect && !citySelect) {
      list = lista.filter((data) => {
        return data.value.store.Categoria === categoriaSelect;
      });
    }
    if (!categoriaSelect && citySelect) {
      list = lista.filter((data) => {
        return data.value.store.Ciudad === citySelect;
      });
    }
    if (!citySelect && !categoriaSelect) {
      setActive(1);
      return setNewList(null);
    }
    setNewList(list);
  };
  const HandleBusq = () => {
    let categoriaSelect;
    let citySelect;
    if (!categ && !cargando) {
      try {
        categoriaSelect = document.getElementById("categoriaSelect").value;
      } catch (error) {}
    } else {
      categoriaSelect = categ;
    }
    if (!ciud && !cargando) {
      try {
        citySelect = document.getElementById("citySelect").value;
      } catch (error) {}
    } else {
      citySelect = ciud;
    }
    if (categoriaSelect || citySelect) {
      return (
        <div className="text-center m-1 mb-3 texto-filtro">
          Filtrando por{" "}
          {categoriaSelect && (
            <span className="txt-1">
              {" "}
              Categoria: <span className="txt-cat">
                {" "}
                {categoriaSelect}
              </span>{" "}
            </span>
          )}
          {categoriaSelect && citySelect && <span>y </span>}
          {citySelect && (
            <span className="txt-1">
              {" "}
              Ciudad: <span className="txt-cat">{citySelect}</span>
            </span>
          )}
        </div>
      );
    }
  };
  const handleSearch = (e) => {
    setActive(1);
    let categoriaSelect = document.getElementById("categoriaSelect").value;
    let citySelect = document.getElementById("citySelect").value;
    search(categoriaSelect, citySelect);
  };
  const clearCategoria = (e) => {
    setActive(1);
    e.preventDefault();
    setCateg("");
    document.getElementById("categoriaSelect").value = "";
    let categoriaSelect = false;
    let citySelect = document.getElementById("citySelect").value;
    search(categoriaSelect, citySelect);
  };
  const clearCity = (e) => {
    setActive(1);
    e.preventDefault();
    setCiud("");
    document.getElementById("citySelect").value = "";
    let categoriaSelect = document.getElementById("categoriaSelect").value;
    let citySelect = false;
    search(categoriaSelect, citySelect);
  };
  if (cargando) {
    return (
      <div>
        <div className="d-flex justify-content-center m-5 p-5">
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  if (newList && !cargando) {
    return (
      <div className="">
        <div className="bg-info d-flex flex-row justify-content-center pt-2">
          <div>
            <form className="d-flex flex-row  justify-content-center">
              <div className="text-center">
                <h5 className="text-busq-cat">Buscar por Categoria</h5>
                <div className="d-flex flex-row  justify-content-center">
                  <select
                    onChange={(e) => {
                      e.preventDefault();
                      setCateg(e.target.value);
                      handleSearch();
                    }}
                    id="categoriaSelect"
                    value={categ}
                    className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg"
                  >
                    <option value="">Ninguna</option>
                    {categoriaList}
                  </select>
                  <span>
                    <button
                      onClick={clearCategoria}
                      className="btn btn-lg btn-secondary m-2 boton-borrar"
                    >
                      Borrar
                    </button>
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h5 className="text-busq-cat">Buscar por Ciudad</h5>
                <div className="d-flex flex-row  justify-content-center">
                  <select
                    onChange={(e) => {
                      e.preventDefault();
                      setCiud(e.target.value);
                      handleSearch();
                    }}
                    id="citySelect"
                    value={ciud}
                    className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg"
                  >
                    <option value="">Ninguna</option>
                    {cityLista}
                  </select>
                  <span>
                    <button
                      onClick={clearCity}
                      className="btn btn-lg btn-secondary m-2 boton-borrar"
                    >
                      Borrar
                    </button>
                  </span>
                </div>
              </div>
            </form>
            <HandleBusq />
          </div>
        </div>
        {newList.length > 0 && (
          <div>
            <div className="d-flex flex-row justify-content-center m-2 buscar-txt">
              <label className="m-1">Resultados por Página</label>
              <input
                className="form-input busqueda"
                type="number"
                min="1"
                max="10"
                defaultValue={resultados + 1}
                onChange={(e) => {
                  e.preventDefault();
                  setActive(1);
                  if (isNaN(e.target.value)) {
                    setResultados(4);
                  }
                  if (!e.target.value || e.target.value < 1) {
                    setResultados(4);
                  }
                  if (e.target.value > 10) {
                    setResultados(9);
                  }
                  if (e.target.value >= 1 && e.target.value < 10) {
                    setResultados(parseInt(e.target.value) - 1);
                  }
                }}
              ></input>
              <span className="m-1">(min:1 - max:10)</span>
            </div>
            <div className="text-center m-1 texto-busqueda">
              Mostrando Tiendas <b>{(active - 1) * (resultados + 1) + 1}</b> a{" "}
              <b>
                {active * (resultados + 1) < newList.length && (
                  <span>{active * (resultados + 1)}</span>
                )}
                {active * (resultados + 1) >= newList.length && (
                  <span>{newList.length}</span>
                )}
              </b>{" "}
              de un total de <b>{newList.length}</b> Tiendas - Página{" "}
              <b>{active}</b> de{" "}
              <b>{Math.ceil(newList.length / (resultados + 1))}</b>
            </div>
          </div>
        )}
        {newList.length === 0 && (
          <div>
            <div className="text-center m-1 texto-busqueda mb-3">
              <h5 className="m-3 pb3">
                No se encontraron resultados de tu busqueda
              </h5>
            </div>
          </div>
        )}
        <DataViewCategoria />
      </div>
    );
  }
  if (lista && !cargando) {
    return (
      <div className="">
        <div className="bg-info d-flex flex-row justify-content-center pt-2">
          <div>
            <form className="d-flex flex-row  justify-content-center">
              <div className="text-center">
                <h5 className="text-busq-cat">Buscar por Categoria</h5>
                <div className="d-flex flex-row  justify-content-center">
                  <select
                    onChange={(e) => {
                      e.preventDefault();
                      setCateg(e.target.value);
                      handleSearch(e);
                    }}
                    id="categoriaSelect"
                    value={categ}
                    className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg"
                  >
                    <option value="">Ninguna</option>
                    {categoriaList}
                  </select>
                  <span>
                    <button
                      onClick={clearCategoria}
                      className="btn btn-lg btn-secondary m-2 boton-borrar"
                    >
                      Borrar
                    </button>
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h5 className="text-busq-cat">Buscar por Ciudad</h5>
                <div className="d-flex flex-row  justify-content-center">
                  <select
                    onChange={(e) => {
                      e.preventDefault();
                      setCiud(e.target.value);
                      handleSearch(e);
                    }}
                    id="citySelect"
                    value={ciud}
                    className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg"
                  >
                    <option value="">Ninguna</option>
                    {cityLista}
                  </select>
                  <span>
                    <button
                      onClick={clearCity}
                      className="btn btn-lg btn-secondary m-2 boton-borrar"
                    >
                      Borrar
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="d-flex flex-row justify-content-center m-2  buscar-txt">
            <label className="m-1">Resultados por Página</label>
            <input
              className="form-input busqueda"
              type="number"
              min="1"
              max="10"
              defaultValue={resultados + 1}
              onChange={(e) => {
                e.preventDefault();
                setActive(1);
                if (isNaN(e.target.value)) {
                  setResultados(4);
                }
                if (!e.target.value || e.target.value < 1) {
                  setResultados(4);
                }
                if (e.target.value > 10) {
                  setResultados(9);
                }
                if (e.target.value >= 1 && e.target.value < 10) {
                  setResultados(parseInt(e.target.value) - 1);
                }
              }}
            ></input>
            <span className="m-1">(min:1 - max:10)</span>
          </div>
          <div className="text-center m-1">
            Mostrando Tiendas <b>{(active - 1) * (resultados + 1) + 1}</b> a{" "}
            <b>
              {active * (resultados + 1) < lista.length && (
                <span>{active * (resultados + 1)}</span>
              )}
              {active * (resultados + 1) >= lista.length && (
                <span>{lista.length}</span>
              )}
            </b>{" "}
            de un total de <b>{lista.length}</b> Tiendas - Página{" "}
            <b>{active}</b> de{" "}
            <b>{Math.ceil(lista.length / (resultados + 1))}</b>
          </div>
        </div>
        <DataView />
      </div>
    );
  }
}
export default Stores;