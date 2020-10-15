import * as React from "react";

export const ButtonActions = {
  PRESSED: 'pressed',
  RELEASED: 'released',
  ENTER: 'enter',
  LEAVE: 'leave',
};

export const FetchActions = {
  START: 'start',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const Section = ({title, children}) => {
  return (
    <div className="section">
      <h4>{title}</h4>
      {children}
    </div>
  );
};

const TodosMock = [
  {
    id: 1,
    text: "delectus aut autem",
  },
  {
    id: 2,
    text: "quis ut nam facilis et officia qui",
  },
  {
    id: 3,
    text: "fugiat veniam minus",
  },
  {
    id: 4,
    text: "et porro tempora",
  },
  {
    id: 5,
    text: "laboriosam mollitia et enim quasi adipisci quia provident illum",
  },
  {
    id: 6,
    text: "qui ullam ratione quibusdam voluptatem quia omnis",
  },
  {
    id: 7,
    text: "illo expedita consequatur quia in",
  },
  {
    id: 8,
    text: "quo adipisci enim quam ut ab",
  },
  {
    id: 9,
    text: "molestiae perspiciatis ipsa",
  },
  {
    id: 10,
    text: "illo est ratione doloremque quia maiores aut",
  },
  {
    id: 11,
    text: "vero rerum temporibus dolor",
  },
  {
    id: 12,
    text: "ipsa repellendus fugit nisi",
  },
  {
    id: 13,
    text: "et doloremque nulla",
  },
  {
    id: 14,
    text: "repellendus sunt dolores architecto voluptatum",
  },
  {
    id: 15,
    text: "ab voluptatum amet voluptas",
  },
  {
    id: 16,
    text: "accusamus eos facilis sint et aut voluptatem",
  },
  {
    id: 17,
    text: "quo laboriosam deleniti aut qui",
  },
  {
    id: 18,
    text: "dolorum est consequatur ea mollitia in culpa",
  },
  {
    id: 19,
    text: "molestiae ipsa aut voluptatibus pariatur dolor nihil",
  },
  {
    id: 20,
    text: "ullam nobis libero sapiente ad optio sint",
  },
];

export const fetchItems = (size) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!size || isNaN(size) || size < 0 || size > TodosMock.length) {
        reject(new Error('Invalid size value'));
      } else {
        resolve(TodosMock.slice(0, size));
      }
    }, 1000);
  });
};