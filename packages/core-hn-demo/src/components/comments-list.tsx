import { Component, h, Prop } from '@stencil/core';


@Component({
  tag: 'comments-list'
})
export class CommentsList {

  @Prop() type: any;

  render() {
    const items = this.type.map((comment: any) => {
      return (
        <ion-item>
          <ion-label>
            <h2>
              {`Posted by ${comment.user} ${comment.time_ago}`}
            </h2>
            <div props={{
              innerHTML: comment.content
            }}></div>
          </ion-label>
        </ion-item>
      );
    });

    return (
      <ion-list>
        {items}
      </ion-list>
    );
  }
}
