import React from 'react';
import { Link } from 'react-router-dom';
import Moment from "react-moment";
import {FaTrash} from "react-icons/fa";
import {MdEdit} from "react-icons/md";

export default function ListingItemDoc({ users, listing, id, onEdit, onDelete }) {
  return(
   <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
            <Link to={`/category/${listing.nivelDeAcesso}/${id}`}>
              <div className='w-full p-[70px]  '>
                <Moment className=" font-semibold text-sm mb-[2px] text-gray-600 truncate"
                    fromNow>
                  {listing.timestamp?.toDate()}
                  </Moment>
                  <p className="font-semibold m-0 text-xl truncate" >{listing.tituloDocTestes}</p>
              </div>
            </Link>
            {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(listing.id)}
        />
      )}

      </li>
  );
  }