import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Resource } from '../../typeDefs/typedefs';
import { ResourceService } from '../../core/services/resource.service';

import { User,allResources, createPost, allResourcesResponse, createPostResponse } from '../../queries/queries'

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  resources$: Observable<Resource[]>;
  allResource: Resource[] = []
  postAuthor: string = 'JPhan'
  titlePost: string = ''
  post: string = ''
  link: string = ''

  constructor(
    private apollo: Apollo,
    private resourceService: ResourceService
  ) {
    this.resources$ = this.resourceService.resources();
  }


  //This creates a new post for the user
  newPanel(titleP: string, commentP: string, linkP: string) {

    var div = document.createElement('div');
    div.className = 'container';
    var divRow = document.createElement('div');
    divRow.className = 'row';
    divRow.style.margin = "20px";
    var divColImg = document.createElement('div');
    divColImg.className = 'col col-sm-2';
    var profileLink = document.createElement('a');
    profileLink.href = "/userProfile";
    var img = document.createElement('img');
    img.className = 'rounded';
    img.height = 100;
    img.width = 100;
    img.style.marginTop = '30px';

    
   
    // img.src = 'https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/GettyImages-968727464_u6ymkm/donald-trump-insults-lebron-james-twitter.jpg';
    img.src = 'https://png.pngtree.com/svg/20170602/person_1058425.png'
    var panel = document.createElement('div');
    panel.className = 'col col-lg-14';
    var card = document.createElement('div');
    card.className = 'card';
    var cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = titleP;
    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    var innerDiv = document.createElement('div');
    var comment = document.createElement('p');
    comment.className = 'card-text';
    comment.innerHTML = commentP;
    var link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.href = linkP;
    console.log("This is the link" + this.link);
    link.innerHTML = "Go to source";

    div.appendChild(divRow);
    divColImg.appendChild(profileLink);
    profileLink.appendChild(img);
    divRow.appendChild(divColImg);
    divRow.appendChild(panel);
    panel.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(innerDiv);
    innerDiv.appendChild(comment);
    innerDiv.appendChild(link);

    document.body.appendChild(div);
  }

  shareButton() {
    var linkFill: string = 'https://'
    if (this.post !== "" && this.titlePost !== "" && this.link !== "") {
      if(!this.link.includes("https://")){
        linkFill += this.link
        this.link = linkFill
      }
      this.findUser(this.postAuthor, this.link)
    }
  }

  ngOnInit() {
    this.apollo
      .watchQuery<allResourcesResponse>({
        query: allResources
      })
      .valueChanges
      .subscribe((response) => {
        this.allResource = response.data.resources
        console.log(this.allResource)
      for (var i = this.allResource.length-1; i >= 0; i--) {
        this.newPanel(this.allResource[i].title, this.allResource[i].content, this.allResource[i].link);
        this.shareButton();
      }
      })
    }

createPost(nameId, link) {
  this.apollo
    .mutate<createPostResponse> ({
      mutation: createPost,
      variables: {
        author: String(nameId),
        title: this.titlePost,
        content: this.post,
        link: link
      }
    }).subscribe(({data}) => {
      console.log(data)

      // Comment this out for faster posting, instead of forced page refresh (posts will not show on button press)
      window.location.reload()
    })
}

findUser(nim, link) {
  this.apollo
    .watchQuery<any> ({
      query: User,
      variables: {
        userName: nim
      }
    })
    .valueChanges
    .subscribe((response) => {
      let name = response.data.userNim.id
      console.log(name)
      this.createPost(name, link)
    })
}

}
