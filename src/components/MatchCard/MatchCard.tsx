
import { MapPin, Users, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface Match {
  id: string;
  title: string;
  location: string;
  time: string;
  date: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  isLastMinute?: boolean;
  discountPercentage?: number;
}

interface MatchCardProps {
  match: Match;
  className?: string;
}

const MatchCard = ({ match, className }: MatchCardProps) => {
  const {
    id,
    title,
    location,
    time,
    date,
    availableSpots,
    totalSpots,
    price,
    level,
    isLastMinute,
    discountPercentage
  } = match;

  // Calculate discounted price if applicable
  const finalPrice = isLastMinute && discountPercentage
    ? price - (price * (discountPercentage / 100))
    : price;

  // Determine level color
  const getLevelColor = () => {
    switch (level) {
      case 'Básico':
        return 'bg-blue-100 text-blue-800';
      case 'Intermedio':
        return 'bg-orange-100 text-orange-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate availability percentage
  const availabilityPercentage = (availableSpots / totalSpots) * 100;

  return (
    <Link to={`/match/${id}`} className={cn('block', className)}>
      <div className="glass-card rounded-2xl overflow-hidden card-hover">
        {isLastMinute && (
          <div className="bg-fuchiball-gold text-white px-4 py-1 font-medium text-sm flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" />
            Último minuto - {discountPercentage}% descuento
          </div>
        )}
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-fuchiball-black">{title}</h3>
            <div className={cn('px-3 py-1 rounded-full text-xs font-medium', getLevelColor())}>
              {level}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-fuchiball-green" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-fuchiball-green" />
              <span>{date} • {time}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-fuchiball-green" />
              <span>{availableSpots} cupos disponibles</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              {isLastMinute && discountPercentage ? (
                <div className="flex items-center">
                  <span className="text-gray-500 line-through text-sm mr-2">S/{price}</span>
                  <span className="font-bold text-fuchiball-green text-xl">S/{finalPrice.toFixed(0)}</span>
                </div>
              ) : (
                <span className="font-bold text-fuchiball-green text-xl">S/{price}</span>
              )}
            </div>
            
            <div className="flex items-center">
              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className={cn(
                    "h-2 rounded-full",
                    availabilityPercentage > 60 ? "bg-fuchiball-green" : 
                    availabilityPercentage > 30 ? "bg-orange-400" : "bg-red-500"
                  )}
                  style={{ width: `${100 - availabilityPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{totalSpots - availableSpots}/{totalSpots}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
