class Spot < ActiveRecord::Base
  belongs_to :user
  acts_as_gmappable :validation => true
  
  before_create :gmaps4rails_address
  def gmaps4rails_address
      #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
      "#{self.address}"
  end
end
