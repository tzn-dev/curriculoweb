export const initialState = {
  show_curriculo: null,
  show_formacao: null,
  show_conhecimento: null,
  show_experiencia: null,
  edit_mode: false,
  idade: null,
  modal_escola: false,
  modal_conhecimento: false,
  modal_experiencia: false,
}
const curriculoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_CURRICULO': return { ...state, show_curriculo: action.values };
    case 'SHOW_FORMACAO': return { ...state, show_formacao: action.values };
    case 'SHOW_CONHECIMENTO': return { ...state, show_conhecimento: action.values };
    case 'SHOW_EXPERIENCIA': return { ...state, show_experiencia: action.values };
    case 'EDIT_MODE': return { ...state, edit_mode: action.values };
    case 'IDADE': return { ...state, idade: action.values };
    case 'MODAL_ESCOLA': return { ...state, modal_escola: action.values };
    case 'MODAL_CONHECIMENTO': return { ...state, modal_conhecimento: action.values };
    case 'MODAL_EXPERIENCIA': return { ...state, modal_experiencia: action.values };
   default: return state
   }
}

export default curriculoReducer;