import express from 'express'
import { pinghandler } from '../../controllers/pinghandler';


const pingrouter=express.Router();

pingrouter.get('/',pinghandler)
export default pingrouter