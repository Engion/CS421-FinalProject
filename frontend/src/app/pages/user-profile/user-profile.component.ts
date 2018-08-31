import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Resource } from '../../typeDefs/typedefs';
import { ResourceService } from '../../core/services/resource.service';

import { User,allResources, createPost, allResourcesResponse, createPostResponse } from '../../queries/queries'


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 resources$: Observable<Resource[]>;
 allResource: Resource[] = []
  postAuthor: string = 'dev'
  titlePost: string = ''
   post: string = ''
   link: string = ''

  constructor(
    private apollo: Apollo,
    private resourceService: ResourceService
   ) {
  //   this.resources$ = this.resourceService.resources();
   }

  ngOnInit() {
    // this.apollo
    //   .watchQuery<allResourcesResponse>({
    //     query: allResources
    //   })
    //   .valueChanges
    //   .subscribe((response) => {
    //     this.allResource = response.data.resources
    //     console.log(this.allResource)
    //   for (var i = 0; i < this.allResource.length; i++) {
    //     this.newPanel(this.allResource[i].title, this.allResource[i].content, this.allResource[i].link);
    //     this.shareButton();
    //   }
    //   })
  }
  newPanel(titleP: string, commentP: string, linkP: string) {


    var divRow = document.createElement('div');
    divRow.className = 'row';
    divRow.style.margin = "20px";
    
    var panel = document.createElement('div');
    panel.className = 'col col-md-6';
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

    //divColImg.appendChild(img);
    //divRow.appendChild(divColImg);
    divRow.appendChild(panel);
    panel.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(innerDiv);
    innerDiv.appendChild(comment);
    innerDiv.appendChild(link);

    document.body.appendChild(divRow);
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
