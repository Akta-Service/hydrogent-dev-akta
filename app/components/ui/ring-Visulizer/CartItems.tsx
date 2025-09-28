import React from 'react';

interface CartItemProps {
  name: string;
  material: string;
  price: number | string;
  imageData: string; 
  details?: Record<string, string | number>;
  type: string;
}

const CartItem: React.FC<CartItemProps> = ({type, name, material, price, imageData, details }) => (
  <div className="flex items-center justify-between mb-2 border border-[#3D3D3D] p-4 bg-[#f6f6f6] text-primary rounded-lg">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
        <img src={imageData} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="text-[18px] outfit font-normal">{name}</h3>
        <p className="text-[13px] outfit font-light text-primary">{material}</p>
        {details && (
          <div className="text-[13px] outfit font-light mt-1">
            {Object.entries(details).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        )}
        <div className="space-x-2 text-[16px] outfit font-light">
        <button className="text-primary underline">View</button>
        <button className="text-primary underline">Edit</button>
      </div>
      </div>
    </div>
    <div className="flex flex-col items-end space-y-1">
      <div className="text-[18px] outfit">${price}</div>
      
    </div>
    
  </div>
);

export default CartItem;
