import React from 'react';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
          {review.user?.name?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-semibold">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {review.createdAt && format(new Date(review.createdAt), 'MMM yyyy')}
          </p>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
