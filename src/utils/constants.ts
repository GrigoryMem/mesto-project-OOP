export const API_URL = `${process.env.API_ORIGIN}/v1/wff-cohort-26`;
export const settings = {
    headers: {
      authorization:`${process.env.API_TOKEN}`,
      'Content-Type': 'application/json'
    },
};

//  библиотека validate - для работы регулярных выражений
export const constraintsUser = {
	name: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
      tooShort: "^Слишком короткое имя, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное имя, необходимо %{count} букв или меньше",
		},
		format: {
			pattern: /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
			message:
				'^Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
		},
	},
  about: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
      tooShort: "^Слишком короткое значение, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное значение, необходимо %{count} букв или меньше",
		},
			format: {
			pattern: /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
			message:
				'^Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
		},
  }
};

export const constraintsAvatar = {
	avatar: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		url: {message: '^Некорректный адрес'},
	},
}

export const constraintsCard = {
	name: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 30,
      tooShort: "^Слишком короткое имя, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное имя, необходимо %{count} букв или меньше",
		},
		format: {
			pattern: /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
			message:
				'^Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
		},
	},
  link: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		url: {message: '^Некорректный адрес'},
  }
};
