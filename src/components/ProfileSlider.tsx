'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Profile {
  _id: string;
  name: string;
  age: number;
  gender: string;
  education: string;
  occupation: string;
  city: string;
  photoUrl?: string;
  requirements: {
    ageRange: { min: number; max: number };
    education: string;
    occupation: string;
  };
}

export default function ProfileSlider() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/featured-profiles');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched profiles:', data.profiles?.length || 0);
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        } else {
          setError('No profiles available yet');
        }
      } else {
        setError('Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Error loading profiles');
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-teal-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Featured Profiles</h2>
            <p className="text-gray-600 text-xs">Discover your perfect match</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 && !loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-teal-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Featured Profiles</h2>
            <p className="text-gray-600 text-xs">
              {error || 'No profiles available yet. Create your profile to get started!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-teal-50/50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Featured Profiles</h2>
          <p className="text-gray-600 text-xs">Discover your perfect match</p>
        </div>
        
        <Slider {...settings} className="profile-slider">
          {profiles.map((profile) => (
            <div key={profile._id} className="px-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Blurred Photo */}
                <div className="relative h-48 bg-gradient-to-br from-teal-100 to-emerald-100 overflow-hidden">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover blur-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">
                        {profile.gender === 'Male' ? '👨' : '👩'}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Age Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-800">{profile.age} yrs</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{profile.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">📍 {profile.city}</p>
                  
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="w-20 font-medium">Education:</span>
                      <span className="flex-1 truncate">{profile.education}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <span className="w-20 font-medium">Work:</span>
                      <span className="flex-1 truncate">{profile.occupation}</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">Looking For:</p>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-1.5">🎂</span>
                        <span>{profile.requirements.ageRange.min}-{profile.requirements.ageRange.max} years</span>
                      </div>
                      {profile.requirements.education && (
                        <div className="flex items-center text-xs text-gray-600">
                          <span className="mr-1.5">🎓</span>
                          <span className="truncate">{profile.requirements.education}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link href="/profiles">
                    <button className="w-full mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:from-teal-600 hover:to-emerald-600 transition-all">
                      View All Profiles
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        .profile-slider .slick-dots {
          bottom: -40px;
        }
        
        .profile-slider .slick-dots li button:before {
          color: #14b8a6;
          font-size: 8px;
        }
        
        .profile-slider .slick-dots li.slick-active button:before {
          color: #0d9488;
        }

        .profile-slider .slick-prev,
        .profile-slider .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }

        .profile-slider .slick-prev {
          left: -50px;
        }

        .profile-slider .slick-next {
          right: -50px;
        }

        .profile-slider .slick-prev:before,
        .profile-slider .slick-next:before {
          color: #0d9488;
          font-size: 30px;
        }

        @media (max-width: 768px) {
          .profile-slider .slick-prev {
            left: 10px;
          }

          .profile-slider .slick-next {
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
}
