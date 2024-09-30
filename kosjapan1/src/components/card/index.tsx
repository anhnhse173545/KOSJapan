import { Food } from "../../models/food";
import "./index.scss"
interface CardProps{
    food: Food;

}
function Card({ food }: CardProps) {
    const{name,description, image , price } = food;
    
  return (
  <div className="food-card">
    <img src="{image}" alt="" />
    <div>
        <span>{name}</span>
        <span>{price}</span>
    </div>

    <p>{description}</p>
  </div>
  );
  
}

export default Card;