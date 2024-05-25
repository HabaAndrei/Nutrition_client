import React from 'react'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";



const Modal_delete = (props) => {


    const styleDoiJS = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        backgroundColor: "white",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      };
  return (
    <div>

        <Modal
        open={props.isModalOpen.type}
        onClose={()=>{props.setIsModalOpen({type: false})}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={styleDoiJS}>
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{props.mes}</h3>
                    <button onClick={()=>{
                        if(props.id){
                            props.stergem(props.id); 
                            props.setIsModalOpen({type : false})
                        }else{ 
                            props.stergem(); 
                            props.setIsModalOpen({type : false, confirm: true})
                        }
                        }} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                        Yes, I'm sure
                    </button>

                    <button onClick={()=>{props.setIsModalOpen({type : false})}} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                        No, cancel
                    </button>
                </div>
            </Box>
        </Modal>
    </div>
  )
}

export default Modal_delete;