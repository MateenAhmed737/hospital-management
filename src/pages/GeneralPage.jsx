import { useState } from "react";
import {
  Button,
  CommonTable,
  CreateModal,
  EditModal,
  ImagesViewer,
  Loader,
  Page,
  Pagination,
  ViewModal,
  NotificationModal,
} from "../components";
import { BiSearch } from "react-icons/bi";
import MediaModal from "../components/Modals/MediaModal";

const GeneralPage = ({
  title,
  actionCols = ["Edit", "Block/Unblock", "Delete"],
  headerStyles = "",
  template,
  setData,
  isLoading,
  pagination,
  notificationModalProps = {},
  imagesViewerProps = {},
  createModalProps = {},
  editModalProps = {},
  viewModalProps = {},
  tableProps = {},
  actions = {},
  deleteUrl,
  blockUrl,
  search,
  headerButtons,
  inputContainer,
}) => {
  const [selected, setSelected] = useState([]);
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [createModal, setCreateModal] = useState({
    isOpen: false,
    data: template,
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    data: null,
  });
  const [imagesViewer, setImagesViewer] = useState({
    isOpen: false,
    images: null,
  });
  const [mediaModal, setMediaModal] = useState({
    isOpen: false,
    media: null,
  });
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    media: null,
  });

  const handleClick = () =>
    createModalProps?.handleClick
      ? createModalProps?.handleClick(setCreateModal)
      : setCreateModal({ ...createModal, isOpen: true });

  const styles = {
    main: `relative ${
      isLoading ? "flex justify-center items-center h-[70vh]" : ""
    }`,
  };

  return (
    <Page title={title} enableHeader>
      <div
        className={`flex items-center justify-between mb-2 space-x-2 ${headerStyles}`}
      >
        {/* Search bar start */}
        {search && (
          <>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div
              className={`relative !ml-0 w-full xs:w-auto ${inputContainer}`}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BiSearch />
              </div>
              <input
                id="table-search"
                className="block w-full p-2 pl-10 text-xs text-gray-900 border border-gray-400 rounded-lg md:w-80 bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                {...search}
              />
            </div>
          </>
        )}
        {/* Search bar end */}

        <div className="flex items-center space-x-1.5">
          {headerButtons}
          {selected.length > 1 && (
            <Button
              title="Bulk Notification"
              handleClick={() =>
                setNotificationModal({ isOpen: true, isBulk: true })
              }
            />
          )}

          {createModalProps.initialState && (
            <Button title="Create" handleClick={handleClick} />
          )}
        </div>
      </div>

      <p className="mt-3 mb-2 text-xs">{pagination.curLength} results</p>

      <Pagination {...pagination} />

      <main className={styles.main}>
        {isLoading ? (
          <Loader />
        ) : (
          <CommonTable
            {...{
              template,
              selected,
              actionCols,
              setSelected,
              setState: setData,
              state: pagination?.paginatedData?.curItems,
              props: {
                blockUrl,
                deleteUrl,
                setViewModal,
                setEditModal,
                setMediaModal,
                setImagesViewer,
                setNotificationModal,
                setPaginatedData: pagination?.setPaginatedData,
                ...actions,
              },
              ...tableProps,
              ...pagination,
            }}
          />
        )}

        {/* Modals */}
        {createModal.isOpen && (
          <CreateModal
            {...{ createModal, setCreateModal, ...createModalProps }}
          />
        )}
        {editModal.isOpen && (
          <EditModal {...{ editModal, setEditModal, ...editModalProps }} />
        )}
        {viewModal.isOpen && (
          <ViewModal {...{ viewModal, setViewModal, ...viewModalProps }} />
        )}
        {imagesViewer.isOpen && (
          <ImagesViewer
            {...{ imagesViewer, setImagesViewer, ...imagesViewerProps }}
          />
        )}
        {mediaModal.isOpen && <MediaModal {...{ mediaModal, setMediaModal }} />}
        {notificationModal.isOpen && (
          <NotificationModal
            {...{
              selected,
              setSelected,
              paginatedData: pagination.paginatedData,
              notificationModal,
              setNotificationModal,
              ...notificationModalProps,
            }}
          />
        )}
      </main>
    </Page>
  );
};

export default GeneralPage;
