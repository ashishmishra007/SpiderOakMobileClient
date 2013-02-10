/*jshint expr:true */
describe('FoldersView', function() {
	beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.b32username = "ORSXG5DVONSXE3TBNVSQ"; // nibbler b32 of "testusername"
  });
  afterEach(function() {
    this.server.restore();
  });
  describe('Instantiation', function() {
    beforeEach(function() {
      this.server.respondWith(
        "GET",
        "https://spideroak.com/storage/" + this.b32username +
          "/Test%20device/test/",
        [
          200,
          {"Content-Type": "test/html"},
          '{"dirs": [["test folder/", "test%20folder/"], ["tmp/", "tmp/"] ],'+
            ' "files": [{"ctime": 1359167989, "etime": 1359167998, '+
            '"mtime": 1359167946, "name": "filename.pdf", "size": 255434, '+
            '"url": "filename.pdf", "versions": 2 } ] }'
        ]
      );
      this.filesCollection = new spiderOakApp.FoldersCollection();
      this.filesCollection.url = "https://spideroak.com/storage/" +
                                    this.b32username + "/Test%20device/test/";
      this.view = new spiderOakApp.FoldersListView({
        collection: this.filesCollection,
        el: $("<ul id='files' class='edgetoedge'></ul>")
      }).render();
      sinon.spy(this.view,'addOne');
      sinon.spy(this.view,'addAll');
      this.server.respond();
    });
    it('should create a list element', function() {
      this.view.el.nodeName.should.equal("UL");
      $(this.view.el).should.have.class("edgetoedge");
    });
    describe('Methods', function() {
      it('should call addAll', function() {
        this.view.addAll.should.have.been.called;
      });
      it('should call addOne', function() {
        this.view.addOne.should.have.been.called;
      });
    });
    describe('List items', function() {
      it('should append a list item for each model', function() {
        this.view.$("li").length
          .should.equal(this.view.collection.models.length);
      });
      it('should display the name of the model', function() {
        // well... it might have a leading space... trim it first
        var liText = this.view.$("li").first().text().replace(/^\s/,"");
        var modelName = this.view.collection.at(0).get("name");
        liText.should.equal(modelName);
      });
      it('should set the model in the dataset', function() {
        var dataModel = this.view.$("li a").first().data("model");
        var collectionModel = this.view.collection.at(0);
        dataModel.should.equal(collectionModel);
      });
    });
  });
});
