class SpotsController < ApplicationController
  # GET /spots
  # GET /spots.xml
  def index
    @spots = Spot.all
    @categories = Spot.getCategories
    @areas = Spot.getAreas
    
    if(params[:category])
      if(params[:category].length > 0)
        @spots = Spot.find_all_by_category(params[:category])
        puts "Filtering by category."
      end
    end
    
    if(params[:area])
      if(params[:area].length > 0)   
        @spots = Spot.find_all_by_area(params[:area])
         puts "Filtering by area."
      end
    end
    
    if (params[:category] and params[:area])
      if (params[:category].length > 0 and params[:area].length > 0)
        @spots = Spot.where("category = ? AND area = ?", params[:category], params[:area])
        puts "Filtering by both category and area."
      end
    end


    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @spots }
      format.json  { render :json => @spots }
    end
  end

  # GET /spots/1
  # GET /spots/1.xml
  def show
    @spot = Spot.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @spot }
      format.json  { render :json => @spot }
    end
  end

  # GET /spots/new
  # GET /spots/new.xml
  def new
    @spot = Spot.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @spot }
      format.json  { render :json => @spot }
    end
  end

  # GET /spots/1/edit
  def edit
    @spot = Spot.find(params[:id])
  end

  # POST /spots
  # POST /spots.xml
  def create
    @spot = Spot.new(params[:spot])

    respond_to do |format|
      if @spot.save
        format.html { redirect_to(@spot, :notice => 'Spot was successfully created.') }
        format.xml  { render :xml => @spot, :status => :created, :location => @spot }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @spot.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /spots/1
  # PUT /spots/1.xml
  def update
    @spot = Spot.find(params[:id])

    respond_to do |format|
      if @spot.update_attributes(params[:spot])
        format.html { redirect_to(@spot, :notice => 'Spot was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @spot.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /spots/1
  # DELETE /spots/1.xml
  def destroy
    @spot = Spot.find(params[:id])
    @spot.destroy

    respond_to do |format|
      format.html { redirect_to(spots_url) }
      format.xml  { head :ok }
    end
  end
end
