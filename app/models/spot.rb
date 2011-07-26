class Spot < ActiveRecord::Base
  
  validates_numericality_of :longitude
  validates_numericality_of :latitude
  validates_length_of :title, :maximum => 30
  
  def self.getCategories  
    categories = []  
    for spot in self.all
      categories << spot.category
    end
    
    return categories
  end
  
  def self.getAreas  
    areas = []  
    for spot in self.all
      areas << spot.area
    end
    
    return areas
  end
  
  
end
