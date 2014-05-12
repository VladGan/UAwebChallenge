
	$(document).ready(
function diff()
{

	var answer = new Array(); //Массив объектов возвращаемый функцией

	function transpose(a)
	{
		//
		//Функция, которая транспонирует массив а
		//
		var j = a.length-1;
		for (var i = 0; i<a.length/2; i++)
		{
			var tmp = a[i];
			a[i] = a[j-i];
			a[j-i] = tmp;
		}
		return a;
	}
	
	function answer_removed (a)
	{
		a.css("background-color","rgba(231, 117, 115, 0.6)");//изменение бэкграунда удалённого элемента
		var add = {type: "removed",element:a.context}; //Добавление к ответу
		answer.push(add);
	}
	
	function answer_changed (s,a,b)
	{
		a.css("background-color","rgba(231, 189, 115, 0.6)");//изменение бэкграунда изменённого элемента
		var add = {type: "changed",beforeElement:a.context,afterElement:b.context,html:s};//Добавление к ответу
		answer.push(add);
	}
	
	function answer_added (a)
	{
		a.css("background-color","rgba(115, 231, 128, 0.6)");//изменение бэкграунда доюавленого элемента
		var add = {type: "added",element:a.context};//Добавление к ответу
		answer.push(add);
	}
	
	function compare_by_type(a,b)
	{
		//
		//Проверка элементов а и b на равенство типов 
		//
		var type1 = a.get(0).tagName;
		var type2 = b.get(0).tagName;
	
		if (type1 != type2)
				return false;
			else
				return true;
	}
	
	function compare_by_text(a,b)
	{
		//
		//Проверка элементов a и b на равенство текстового контента
		//

		var text1 = a.contents()
		.filter(function()
		{
			return this.nodeType === 3; 
		}).text();
	
		var text2 = b.contents()
		.filter(function()
		{
			return this.nodeType === 3; 
		}).text();
	
		text1 = $.trim(text1); //Удаление пробелов и знака переноса строки
		text2 = $.trim(text2); //Удаление пробелов и знака переноса строки
	
		if (text1.length != text2.length)
			return false;    //Если длины текстов разные, то тексты не могут быть равны
		else
		{
			for (var i=0; i<text1.length; i++)
				if (text1[i] != text2[i])
					return false;
		}
		return true;
	}
	
	
	function make_list(a,b)
	{
		//
		//Пояснение к функции в документе коментарии.txt
		//
		var A = new Array();
		for(var i=0;i<=a.length;i++) 
			A[i] = new Array(b.length);

		var ans_mas_a = []; //масив, в котором указаны индексы элементов с ключевыми типами из матрицы а
		var ans_mas_b = []; //масив, в котором указаны индексы элементов с ключевыми типами из матрицы b

		for (var i=0;i<=a.length;i++) A[i][0] = 0;
		for (var j=0;j<=b.length;j++) A[0][j] = 0;


		for (var i=1;i<=a.length;i++)
			for (var j=1;j<=b.length;j++)
				if (compare_by_type($(a[i-1]),$(b[j-1])))	//Первое условие, Если a[i] = b[j] то A[i][j]=A[i-1][j-1]+1
					A[i][j]=A[i-1][j-1]+1;
				else
					A[i][j]=Math.max(A[i-1][j],A[i][j-1]);	//Второе условие, Если a[i] не равно b[j] то A[i][j] = maximum (A[i-1][j],A[i][j-1])


		var i=a.length; var j=b.length;var d = A[i][j]; //выбор крайнего правого нижнего элемента

		var ans_mas = new Array(d); 
		for (var i=0; i<d; i++)
			ans_mas[i]=new Array(2);

		i=a.length; j=b.length;d = A[i][j];

		while (d!=0) 
		{
			while (A[i][j-1]==d) j--;  // Поиск самого левого верхнего элемента
			while (A[i-1][j]==d) i--;

			ans_mas_a.push(i-1);  // В первый массив записывается индекс из массива a
			ans_mas_b.push(j-1);  // во второй - из массива b
			i--; j--; d--;
		}



		for (var k = 0; k < ans_mas_b.length; k++)  // вычисление конкретных элементов
		{
			//Поиск конкретного элемента (тоесть элемента который не только совпадает по типу, а и по тексту содержания) выполняется в пределах
			//соседей k-го элемента с ключевым типом массива ans_mas_a для массива а, и массива ans_mas_b для массива b соответственно. Тоесть от ans_mas_a[k+1] до ans_mas_a[k-1]
			//относительно массива а (от большего к меньшему индексу поскольку в ходе алгоритма массив переворачивается). Аналогично для b.
			//Также в начале цикла отдельно рассмотрены случаи, когда k = 0 либо k = maximum, тоесть когда невозможно определить элементы с индексом k+1 либо k-1.
			
			if (k == (ans_mas_a.length-1))
				var l1 = 0;
			else
				var l1 = ans_mas_a[k+1]+1;

			if (k == 0)
				var r1 = a.length-1;
			else
				var r1 = ans_mas_a[k-1]-1;



			if (k == (ans_mas_b.length-1))
				var l2 = 0;
			else
				var l2 = ans_mas_b[k+1]+1;

			if (k == 0)
				var r2 = b.length-1;
			else
				var r2 = ans_mas_b[k-1]-1;



			for (var i = l1; i <= r1; i++)
				for (var j = l2; j <= r2; j++)
					if (compare_by_type($(a[i]),$(b[ans_mas_b[k]])) && compare_by_text($(a[i]),$(b[j])) && 
						compare_by_type($(b[j]),$(b[ans_mas_b[k]]))) //если i и j элемент совпадают по типу с ключевым типом, а также совпадают по тексту
					{												 //между собой, то заменяем элемент с ключевым типом на конкретный элемент
						ans_mas_a[k] = i;
						ans_mas_b[k] = j;
						break;
					}
		}


		for (var i = 0; i<ans_mas_a.length; i++)
		{
			ans_mas[i][0] = ans_mas_a[i]; //запись ответа
			ans_mas[i][1] = ans_mas_b[i]; //в один массив
		}

		return transpose(ans_mas); //поскольку массив перевёрнутый, то для удобства он транспонируется
	}
	
	function compare(a,b)
	{
		//
		//Функция compare() сравнивает элементы a и b на равенство типов, равенство текстового контента, и если они совпадают, то формирует 
		//массивы их дочерних элементов. Далее в них выделяется найбольшее количество общих элементов, после чего каждая пара из этих элементов 
		//рекурсивно сравнивается этой же функцией.
		//
		if (!compare_by_type(a,b)) //проверка на разность типов
		{
			answer_removed(a);
			return;
		}
	
		if (!compare_by_text(a,b)) //проверка на разность контента
		{
			answer_changed(b.html(),a,b);
			return;
		}

		var children1 = a.children();//дочерние элементы массива а
		var children2 = b.children();//дочерние элементы массива b

		var ind_a = 0;
		var ind_b = 0;

		var mas = make_list(children1,children2); //формирование максимально большого списка общих элементов
		var i = 0;
		var j = 0;

		while (i < children1.length) //поиск удалённых элементов
			{
				while(i < children1.length && (j>=mas.length || i!= mas[j][0]))
				{
					answer_removed($(children1[i]));
					i++;
				}
				j++;
				i++;
			}


		i = 0;
		j = 0;
		while (i < children2.length) //поиск добавленых элементов
			{
				while(i < children2.length && (j>=mas.length || i!= mas[j][1]))
				{
					answer_added($(children2[i]));
					i++;
				}
				j++;
				i++;
			}

		for (var i=0; i<mas.length; i++)
			arguments.callee($(children1[mas[i][0]]),$(children2[mas[i][1]])); //рекурсивный запуск функции для общих элементов
	}

	var before = $("#before");
	var after = $("#after");
	
	compare (before, after);
	return answer;
});

