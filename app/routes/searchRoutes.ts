import express from 'express';
// import { celebrate } from 'celebrate';

import searchCtrl from '../controller/searchController';
// import { create, update, search } from '../validation/genreValidation';
// import decode, { adminAuth } from '../middleware/decode';
// import { TokenType } from '../services/tokenService';
// import decode, { adminAuth } from '../middleware/decode';
// import { TokenType } from '../services/tokenService';
// const abortEarly = true;
const router = express.Router();
/**  get  */
// router.use(decode(TokenType.AUTH));
/** Admin access */
router.route('/').get(/*celebrate(search, { abortEarly }),*/ searchCtrl.search);
// router.use(adminAuth);
// router.route('/').post(celebrate(create, { abortEarly }), genreCtrl.create);
// router
//   .route('/:id')
//   .put(celebrate(update, { abortEarly }), genreCtrl.update)
//   .delete(genreCtrl.delete);

export default router;
