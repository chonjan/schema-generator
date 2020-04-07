import React from 'react';
import ELEMENT_LIST from './elementList';
import './index.css';
import { useGlobal, useGlobalProps, useStore } from '../hooks';
import { getKeyFromUniqueId } from '../utils';
import nanoid from 'nanoid';

const Left = (props) => (
  <div className="left-layout">
    {ELEMENT_LIST.map((ele, idx) => {
      return (
        <div className="left-item">
          <Element {...ele} {...props} key={idx.toString()} />
        </div>
      );
    })}
  </div>
);

export default Left;

const Element = ({ text, name, schema }) => {
  const setGlobal = useGlobal();
  const { selected } = useGlobalProps();
  const { flatten, onFlattenChange } = useStore();

  const handleElementClick = () => {
    if (!selected) return; //TODO: 不应该return，可以在root上加
    let newId;
    if (selected === '#') {
      newId = '#/' + name;
    } else {
      let _name = name;
      const key = getKeyFromUniqueId(selected);
      if (name === key) {
        _name = name + nanoid(6);
      }
      const idArr = selected.split('/');
      idArr.pop();
      idArr.push(_name);
      newId = idArr.join('/');
    }
    try {
      const newFlatten = { ...flatten };
      const item = newFlatten[selected];
      const siblings = newFlatten[item.parent].children;
      const idx = siblings.findIndex((x) => x === selected);
      siblings.splice(idx + 1, 0, newId);
      const newItem = {
        parent: item.parent,
        schema: { ...schema, $id: newId },
        data: undefined,
        children: [],
      };
      newFlatten[newId] = newItem;
      onFlattenChange(newFlatten);
      setGlobal({ selected: newId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="left-element" onClick={handleElementClick}>
      {text}
    </div>
  );
};
