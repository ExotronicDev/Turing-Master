import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";

import ServiceService from "../../services/ServiceService";
import ClientService from "../../services/ClientService";
import UserContext from "../../context/UserContext";

const ServiceCrudComponent = ({ canPublish }) => {
  const { userData } = useContext(UserContext);

  let serviceRef = new ServiceService();
  let emptyService = {
    name: "",
    description: "",
  };

  const [data, setData] = useState([]);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [deleteserviceDialog, setDeleteServiceDialog] = useState(false);
  const [deleteProductsDialog, setDeleteServicesDialog] = useState(false);

  const [service, setService] = useState(emptyService);
  const [selectedServices, setSelectedServices] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    serviceRef.getServices().then(({ data }) => {
      setData(data);
    });
  }, []);

  const openNew = () => {
    setService(emptyService);
    setSubmitted(false);
    setServiceDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setServiceDialog(false);
  };

  const hideDeleteServiceDialog = () => {
    setDeleteServiceDialog(false);

    console.log(service);
  };

  const saveProduct = () => {
    setSubmitted(true);
    setServiceDialog(false);

    serviceRef
      .addService(service)
      .then(({ data }) => {
        if (data.success)
          toast.current.show({
            severity: "success",
            summary: "Exito!",
            detail: data.message,
            life: 3000,
          });
        return serviceRef.getServices();
      })
      .then(({ data }) => {
        setData(data);
      });
  };

  const confirmDeleteService = (service) => {
    setService(service);
    setDeleteServiceDialog(true);
  };

  const deleteService = () => {
    let _data = data.filter((val) => val.id !== service.id);
    setData(_data);
    setDeleteServiceDialog(false);
    setService(emptyService);

    serviceRef
      .deleteService(service)
      .then(() => serviceRef.getServices())
      .then(({ data }) => {
        setData(data);
      });

    toast.current.show({
      severity: "success",
      summary: "Exito!",
      detail: "El servicio ha sido eliminado",
      life: 3000,
    });
  };

  const addFavoriteService = (service) => {
    new ClientService()
      .addFavoriteService(userData.obj, service)
      .then(({ data }) => {
        if (data.sucess) {
          toast.current.show({
            severity: "success",
            summary: "Exito",
            detail: data.message,
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "warning",
            summary: "Alerta",
            detail: data.message,
            life: 3000,
          });
        }
      });
  };

  const confirmDeleteSelected = () => {
    setDeleteServicesDialog(true);
  };

  const onNameChange = (e) => {
    setService({ ...service, name: e.target.value });
  };

  const onDescriptionChange = (e) => {
    setService({ ...service, description: e.target.value });
  };

  const leftToolbarTemplate = () => {
    return (
      canPublish && (
        <React.Fragment>
          <Button
            label="Nuevo servicio"
            icon="pi pi-plus"
            className="p-button-success p-mr-2"
            onClick={openNew}
          />
        </React.Fragment>
      )
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre</span>
        {rowData.name}
      </>
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Descripcion</span>
        {rowData.description}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return canPublish ? (
      <div className="actions">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteService(rowData)}
        />
      </div>
    ) : (
      <div className="actions">
        <Button
          icon="pi pi-star"
          className="p-button-rounded p-button-warning"
          onClick={() => addFavoriteService(rowData)}
        />
      </div>
    );
  };

  const serviceDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Guardar servicio"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </>
  );
  const deleteServiceDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteServiceDialog}
      />
      <Button
        label="Si, eliminar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteService}
      />
    </>
  );

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            ref={dt}
            value={data}
            selection={selectedServices}
            onSelectionChange={(e) => setSelectedServices(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} servicios"
            globalFilter={globalFilter}
            emptyMessage="No hay servicios"
          >
            <Column
              field="name"
              header="Nombre"
              sortable
              body={nameBodyTemplate}
            ></Column>
            <Column
              field="description"
              header="Descripcion"
              sortable
              body={descriptionBodyTemplate}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={serviceDialog}
            style={{ width: "450px" }}
            header="Detalles de servicio"
            modal
            className="p-fluid"
            footer={serviceDialogFooter}
            onHide={hideDialog}
          >
            <div className="p-field">
              <label htmlFor="name">Nombre</label>
              <InputTextarea
                id="name"
                value={service.name}
                onChange={(e) => onNameChange(e)}
                required
                rows={3}
                cols={20}
              />
            </div>
            <div className="p-field">
              <label htmlFor="description">Descripcion</label>
              <InputTextarea
                id="description"
                value={service.description}
                onChange={(e) => onDescriptionChange(e)}
                required
                rows={3}
                cols={20}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteserviceDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteServiceDialogFooter}
            onHide={hideDeleteServiceDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {service && (
                <span>
                  ¿Estas seguro de eliminar <b>{service.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ServiceCrudComponent;