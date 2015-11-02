import {Injectable, Pipe} from 'angular2/angular2';

@Pipe({
  name: '<%= fileName %>'
})
@Injectable()
class <%= jsClassName %> {
  transform(v, args) { 
    return v.toLowerCase(); 
  }
}
