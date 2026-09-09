export const createTodoBodySchema = {
  type: 'object',
  required: ['title', 'price', 'email'],
  properties: {
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
      errorMessage: {
        type: 'Title harus berupa teks',
        minLength: 'Title minimal berisi 3 karakter',
        maxLength: 'Title maksimal berisi 100 karakter',
      },
    },
    description: {
      type: 'string',
      minLength: 3,
      errorMessage: {
        minLength: 'Deskripsi minimal 3 karakter',
        type: 'Deskripsi harus berupa teks',
      },
    },
    price: {
      type: 'number',
      minimum: 0,
      errorMessage: {
        type: 'Price harus berupa angka',
        minimum: 'Price tidak boleh negatif',
      },
    },
    email: {
      type: 'string',
      format: 'email',
      errorMessage: {
        type: 'Email harus berupa teks',
        format: 'Format email tidak valid',
      },
    },
  },
  errorMessage: {
    required: {
      title: 'Properti title wajib diisi!',
      price: 'Properti price wajib diisi!',
      email: 'Properti email wajib diisi!',
    },
  },
} as const;

export const todoParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      errorMessage: {
        format: 'Format ID harus berupa UUID yang valid',
      },
    },
  },
  errorMessage: {
    required: {
      id: 'Parameter ID wajib disertakan',
    },
  },
} as const;
